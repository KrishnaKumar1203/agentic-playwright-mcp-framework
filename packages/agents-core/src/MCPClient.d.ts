import { AgentOutput } from './index.js';
/**
 * MCP Client for calling agents via MCP protocol
 * Handles agent process lifecycle and communication
 */
export declare class MCPClient {
    private client;
    private process;
    private logger;
    private agentName;
    private agentPath;
    constructor(agentName: string, agentPath: string);
    /**
     * Connect to MCP agent server
     */
    connect(): Promise<void>;
    /**
     * Call agent tool via MCP
     */
    callTool(taskId: string, payload: any, metadata?: Record<string, any>): Promise<AgentOutput>;
    /**
     * Disconnect from agent
     */
    disconnect(): Promise<void>;
    /**
     * Check if client is connected
     */
    isConnected(): boolean;
}
//# sourceMappingURL=MCPClient.d.ts.map