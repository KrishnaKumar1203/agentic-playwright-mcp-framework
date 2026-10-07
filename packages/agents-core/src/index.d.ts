import { Logger } from 'pino';
export interface AgentInput<T = any> {
    id?: string;
    taskId: string;
    payload: T;
    metadata?: Record<string, any>;
    timestamp?: Date;
}
export interface AgentOutput<T = any> {
    id: string;
    taskId: string;
    result: T;
    status: 'success' | 'failure' | 'skipped';
    error?: Error;
    metadata?: Record<string, any>;
    timestamp: Date;
}
export interface AgentConfig {
    name: string;
    version: string;
    timeout?: number;
    retries?: number;
    logger?: Logger;
}
export declare abstract class BaseAgent<In = any, Out = any> {
    id: string;
    config: AgentConfig;
    protected logger: Logger;
    constructor(config: AgentConfig, logger?: Logger);
    abstract execute(input: AgentInput<In>): Promise<AgentOutput<Out>>;
    getName(): string;
    getVersion(): string;
    getId(): string;
}
export { Agent } from './Agent.js';
export { MCPServer } from './MCPServer.js';
export { MCPClient } from './MCPClient.js';
//# sourceMappingURL=index.d.ts.map