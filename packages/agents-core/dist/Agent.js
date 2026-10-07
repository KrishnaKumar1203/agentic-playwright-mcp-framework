import { v4 as uuid } from 'uuid';
import pino from 'pino';
export class Agent {
    constructor(name, version) {
        this.id = uuid();
        this.name = name;
        this.version = version;
        this.logger = pino({
            name: name,
            level: process.env.LOG_LEVEL || 'info',
        }, pino.destination(2));
    }
    getName() {
        return this.name;
    }
    getVersion() {
        return this.version;
    }
    getId() {
        return this.id;
    }
}
//# sourceMappingURL=Agent.js.map