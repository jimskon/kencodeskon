const Docker = require('dockerode');
const EventEmitter = require('events');

class Evaluator extends EventEmitter {
    constructor(userId, language = 'python', timeout = 300) {
        super();
        this.userId = userId;
        this.language = language;
        this.timeout = timeout * 1000; // Convert to milliseconds
        this.docker = new Docker();
        this.container = null;
        this.status = 'initializing';
        this.activeProcesses = new Set();
    }

    async initiateSession() {
        try {
            // Determine Docker image based on language
            const images = {
                python: 'python:3.9-slim',
                javascript: 'node:16-alpine',
                java: 'openjdk:11-jdk-slim'
            };

            this.container = await this.docker.createContainer({
                Image: images[this.language] || images.python,
                Tty: true,
                HostConfig: {
                    AutoRemove: true,
                    Memory: '512M',
                    CpuShares: 512
                }
            });

            await this.container.start();
            this.status = 'running';
            
            // Set timeout if specified
            if (this.timeout) {
                this.timer = setTimeout(() => this._cleanup(), this.timeout);
            }

            this.emit('ready', `Container started for user ${this.userId}`);
            return { success: true, message: 'Container initialized' };
        } catch (err) {
            this.emit('error', `Container initialization failed: ${err.message}`);
            return { success: false, error: err.message };
        }
    }

    async sendCommand(command) {
        if (!this.container || this.status !== 'running') {
            throw new Error('Container not available');
        }

        const exec = await this.container.exec({
            Cmd: ['sh', '-c', command],
            AttachStdout: true,
            AttachStderr: true
        });

        return new Promise((resolve, reject) => {
            const output = [];
            const stream = exec.start({ hijack: true, stdin: true });
            
            stream.on('data', chunk => {
                output.push(chunk.toString());
                this.emit('output', chunk.toString());
            });

            stream.on('end', () => resolve(output.join('')));
            stream.on('error', err => reject(err));
        });
    }

    async sendCode(repoUrl) {
        const commands = [
            `git clone ${repoUrl} /usr/src/app`,
            'cd /usr/src/app',
            this._getRunCommand()
        ].join(' && ');

        return this.sendCommand(commands);
    }

    async restart() {
        await this._cleanup();
        return this.initiateSession();
    }

    async _cleanup() {
        if (this.container) {
            try {
                await this.container.stop();
                this.status = 'stopped';
            } catch (err) {
                this.emit('error', `Cleanup failed: ${err.message}`);
            }
        }
        clearTimeout(this.timer);
    }

    _getRunCommand() {
        return {
            python: 'python3 main.py',
            javascript: 'node index.js',
            java: 'javac Main.java && java Main'
        }[this.language];
    }
}

module.exports = Evaluator;

//USAGE
// const Evaluator = require('./Evaluator');

// // Create new session
// const session = new Evaluator('user123', 'python', 600);
// session.on('ready', console.log);
// session.on('output', console.log);
// session.on('error', console.error);

// await session.initiateSession();
// await session.sendCode('https://github.com/temp/repo');
// await session.restart();