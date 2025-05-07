const Docker = require('dockerode');
const { PassThrough } = require('stream');
const EventEmitter = require('events');

class Evaluator extends EventEmitter {
    constructor(userId, language = 'python', timeout = 300) {
        super();
        this.userId = userId;
        this.language = language;
        this.timeout = timeout * 1000;
        this.docker = new Docker();
        this.container = null;
        this.status = 'initializing';
    }

    async initiateSession() {
        try {
            const images = {
                python: 'python:3.9-slim',
                javascript: 'node:16-alpine',
                java: 'openjdk:11-jdk-slim'
            };

            this.container = await this.docker.createContainer({
                Image: images[this.language] || images.python,
                Tty: true,
                OpenStdin: true,
                HostConfig: {
                    AutoRemove: true,
                    Memory: '512M',
                    CpuShares: 512
                }
            });

            await this.container.start();
            this.status = 'running';
            
            if (this.timeout) {
                this.timer = setTimeout(() => this._cleanup(), this.timeout);
            }

            this.emit('ready', `Container active for ${this.userId}`);
            return { status: 'ready', message: 'Session initialized' };
        } catch (err) {
            this.emit('error', `Session failed: ${err.message}`);
            return { status: 'error', error: err.message };
        }
    }

    async sendCommand(command) {
        if (!this.container || this.status !== 'running') {
            throw new Error('Container not available');
        }

        const exec = await this.container.exec({
            Cmd: ['/bin/sh', '-c', command],
            AttachStdout: true,
            AttachStderr: true,
            Tty: true
        });

        const duplex = await exec.start({ hijack: true, stdin: true });
        const outputStream = new PassThrough();
        
        duplex.on('data', (chunk) => {
            this.emit('output', chunk.toString());
        });

        duplex.on('end', () => {
            this.emit('output', '\r\nCommand completed\r\n');
        });

        return new Promise((resolve) => {
            duplex.on('finish', resolve);
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

    async _cleanup() {
        if (this.container) {
            try {
                await this.container.stop();
                this.status = 'stopped';
            } catch (err) {
                this.emit('error', `Cleanup error: ${err.message}`);
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