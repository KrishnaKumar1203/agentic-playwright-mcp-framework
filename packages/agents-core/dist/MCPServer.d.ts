import { Agent } from './Agent.js';
/**
 * MCP Server Wrapper for Agents
 * Wraps any Agent to expose it as an MCP server via stdio
 */
export declare class MCPServer {
    private server;
    private agent;
    private logger;
    constructor(agent: Agent);
    private setupHandlers;
    private getToolDefinitions;
    start(): Promise<void>;
}
//# sourceMappingURL=MCPServer.d.ts.map