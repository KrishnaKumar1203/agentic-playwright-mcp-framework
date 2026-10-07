import { v4 as uuid } from 'uuid';
export class Agent {
    constructor(name, version) {
        this.id = uuid();
        this.name = name;
        this.version = version;
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