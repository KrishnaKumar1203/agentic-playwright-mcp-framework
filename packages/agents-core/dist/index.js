import { v4 as uuid } from 'uuid';
export class BaseAgent {
    constructor(config, logger) {
        this.id = uuid();
        this.config = config;
        this.logger = logger || console;
    }
    getName() {
        return this.config.name;
    }
    getVersion() {
        return this.config.version;
    }
    getId() {
        return this.id;
    }
}
// Export Agent class from Agent.ts
export { Agent } from './Agent.js';
// Export MCP integration classes
export { MCPServer } from './MCPServer.js';
export { MCPClient } from './MCPClient.js';
//# sourceMappingURL=index.js.map