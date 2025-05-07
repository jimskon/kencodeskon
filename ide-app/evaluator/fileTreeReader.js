export class FileTreeReader {
    constructor(json) {
        this.hierarchy = json;
        this.dirs = [];
        this.files = [];
        this.currentid = 1;
    }
    adaptTree() {
        const rootobj = this.hierarchy[0];
        const rootdir = {
            id: "0",
            title: ".",
            source_id: "src",
            short_id: null,
            path: "/home/appuser/"
        };
        let data
        if (rootobj.contents) {
            this.#iterateTree(rootobj, rootdir);
        }
        data = {
            directories: this.dirs,
            modules: this.files
        };
        return data
    }

    #iterateTree(parent, pdir){
        // console.log(parent)
        if (parent.contents){
        parent.contents.forEach(json => {    
            if (json.type == "directory"){
                var dir = this.#collectDirectory(json);
                dir.directory_shortid = pdir.short_id;
                dir.path = pdir.path + dir.title+ "/";
                this.dirs.push(dir);
                this.#iterateTree(json,dir);
            } else if (json.type == "file"){
                var file = this.#collectFile(json);
                file.directory_shortid = pdir.short_id;
                file.path = pdir.path + file.title;
                this.files.push(file);
            }
        })};
    }
    
    #collectDirectory(obj){
        let dir = {};
        dir.id = `dir_${this.currentid}`;
        this.currentid += 1;
        dir.title = obj.name;
        dir.source_id = "src";
        dir.short_id = dir.id;
        return dir;
    }

    #collectFile(obj){
        let file = {};
        file.id = `file_${this.currentid}`;
        this.currentid += 1;
        file.title = obj.name;
        file.source_id = "src";
        file.short_id = file.id;
        return file;
    }
}