import { exec } from 'child_process';
import { FileTreeReader } from '@/evaluator/fileTreeReader';
const fs = require("fs");

export class Docker {
    constructor() {
        // Function to execute shell commands asynchronously
        this.sh = async function (cmd) {
            return new Promise(function (resolve, reject) {
                exec(cmd, (err, stdout, stderr) => {
                    if (err) {
                        resolve({ stdout, stderr, err });  // Return errors as part of response instead of rejecting
                    } else {
                        resolve({ stdout, stderr });  // Return stdout and stderr if no error
                    }
                });
            });
        };
    }

    /**
     * Initializes a Docker container for the specified programming language.
     */
    async initialize() {
        // Generate a unique container name based on the language and timestamp
        this.containerName = `eval_${new Date().getTime()}`;
        
        // Start the Docker container in detached mode
        const hashID = await this.sh(`docker run -itd --name ${this.containerName} python-gcc-evaluator`);
        this.hashID = hashID.stdout.trim();

        console.log(`Container started with hash ID: ${this.hashID}`);
        return this.hashID;
    }

    async setParams(dockerid){
        this.hashID = dockerid;
        console.log("resuming container with ", this.hashID)
    }
    /**
     * Safely performs file operations (write/delete) with retries to handle potential issues.
     * @param {Function} command - The file operation function (e.g., fs.writeFileSync).
     * @param {string} file - The file path.
     * @param {string} content - (Optional) The content to write.
     */
    #serverSafeFileOp(command, file, content) {
        let lastErr;

        for (let i = 0; i < 100; i++) {
            try {
                if (content) {
                    command(file, content);  // Write content to the file
                } else {
                    command(file);  // Delete the file
                }
                return true;
            } catch (err) {
                lastErr = err;  // Capture the last error encountered
            }
        }
        throw new Error(`Could not complete file operation. Error: ${lastErr}`);
    }

    /**
     * Runs the provided code inside the Docker container.
     * @param {string} exp - The code to execute.
     * @returns {Promise<object>} - The output of the execution.
     */
    async run(exp, language) {
        if (!this.hashID) {
            throw new Error("Docker container is not initialized. Call initialize() first.");
        }

        let tmpFilePath, dockerfile;

        if (language === "python") {
            // Store the Python script temporarily
            tmpFilePath = `/tmp/${this.containerName}.py`;
            this.#serverSafeFileOp(fs.writeFileSync, tmpFilePath, exp);
            dockerfile = `/home/appuser/${this.containerName}.py`
        } else if (language === "cpp") {
            // Store the C++ source file temporarily
            tmpFilePath = `/tmp/${this.containerName}.cpp`;
            this.#serverSafeFileOp(fs.writeFileSync, tmpFilePath, exp);
            dockerfile = `/home/appuser/${this.containerName}.cpp`;
        } else {
            throw new Error("Unsupported language");
        }
        // Copy the file into the container
        await this.sh(`docker cp ${tmpFilePath} ${this.hashID}:${dockerfile}`);

        // Remove the temporary file after copying
        this.#serverSafeFileOp(fs.rmSync, tmpFilePath);

        // Execute the code inside the container and return the result
        return this.runFile(dockerfile);
    }

    runFile(filepath) {
        let command;
        if (filepath.endsWith(".py")) {
            command = `python ${filepath} -u\n`;
        } else if (filepath.endsWith(".cpp")) {
            command = `g++ ${filepath} -o output.exe && ./output.exe\n`;
        } else {
            throw new Error("Unsupported file type. Only Python (.py) and C++ (.cpp) files can be run");
        }
        // const output = await this.sh(command);
        return command;
    }


    async containerFileOp(path, command, confidence = "none") {
        let prompt
        switch(command){
            case "addFile":
                prompt = `docker exec ${this.hashID} touch ${path}`;
                break;
            case "addDirectory":
                prompt = `docker exec ${this.hashID} mkdir ${path}`;
                break;
            case "getFile":
                prompt = `docker exec ${this.hashID} cat ${path}`;
                break;
            case "readDirectory":
                prompt = `docker exec ${this.hashID} ls ${path}`;
                break;
            case "deleteFile":
                prompt = `docker exec ${this.hashID} rm ${path}`;
                break;
            case "deleteDirectory":
                if (confidence == "none") {
                    prompt = `docker exec ${this.hashID} rmdir ${path}`;
                } else {
                    prompt = `docker exec ${this.hashID} rm -r ${path}`;
                }                
                break;
            default:
                throw new Error("Unsupported command");
        }
        const out = await this.sh(prompt);
        console.log(out)
        var content = out.stdout
        if (!content){
            content = "";
        }
        console.log("File Operation returning:",content);
        return content
    }

    async getTree() {
        var systemtree = await this.sh(`docker exec ${this.hashID} tree -J`);
        console.log(systemtree.stdout);
        var reader = new FileTreeReader(JSON.parse(systemtree.stdout));
        var tree = reader.adaptTree();
        console.log(tree)
        return tree
    }

    async updateFile(path, content){
        const serverfile = this.#fileSafePath(path);
        this.#serverSafeFileOp(fs.writeFileSync, serverfile, content);
        await this.sh(`docker cp ${serverfile} ${this.hashID}:${path}`);
        this.#serverSafeFileOp(fs.rmSync, serverfile);
    }

    #fileSafePath(path){
        // replace slashes with dashes
        return `/tmp/slash${path.replace(/\//g, '-')}`;
    }

    async readDirectoryFiles(path) {
        var contents = await this.containerFileOp(path, "readDirectory");
        let mainobj = {};
        contents.forEach(element => {
            var subpath = path+element;
            try {
                const filecontents = docker.containerFileOp(subpath, "getFile");
                mainobj.element = filecontents;
            } catch {
                mainobj.element = null;
            }
        });
    }
    /**
     * Cleans up the Docker container after execution.
     */
    async cleanup() {
        if (!this.hashID) {
            console.warn("No active container to clean up.");
            return;
        }
        // Stop and remove the container
        await this.sh(`docker stop ${this.hashID}`);
        await this.sh(`docker rm ${this.hashID}`);
        console.log("Cleaned up");
    }

    // /**
    //  * Removes leading indentation from a string while preserving formatting.
    //  * @param {string} str - The input string.
    //  * @returns {string} - The formatted string without unnecessary indentation.
    //  */
    // async #removeIndentation(str) {
    //     const lines = str.split('\n').filter(line => line.trim().length > 0);  // Remove empty lines
    //     const minIndent = Math.min(...lines.map(line => line.match(/^ */)[0].length));  // Find minimum indentation
    //     return lines.map(line => line.slice(minIndent)).join('\n');  // Remove leading spaces
    // }
}