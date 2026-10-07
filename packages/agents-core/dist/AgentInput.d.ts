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
    logger?: any;
}
//# sourceMappingURL=AgentInput.d.ts.map