import { throws } from 'assert';
import { Docker } from './docker.js';

export class Evaluator {
    constructor() {
        this.docker = new Docker();
    }

    #cleanData(data) {
        // Replace non-breaking spaces (U+00A0) with a regular space
        let cleaned = data.replace(/\u00A0/g, ' ');

        // Optionally, replace other non-printable/control characters
        // Uncomment the following line to remove all control characters except newline (\n) and tab (\t)
        // cleaned = cleaned.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '');
        
        return cleaned;
    }

    async simplyEvaluate(exp, language, dockerid) {
        if (!["python", "cpp"].includes(language)) {
            throw new Error("Unsupported language. Choose 'python' or 'cpp'.");
        }
        this.docker.setParams(dockerid, language);
        let output;
        try {
            output = await this.docker.run(this.#cleanData(exp),language);
        } catch (err) {
            console.error("Execution error:", err);
            output = { error: err instanceof Error ? err.message : "Unknown error" };
        }
        console.log(output);
        return output;
    }
}