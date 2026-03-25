import { v4 as uuid } from 'uuid';
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

export abstract class BaseAgent<In = any, Out = any> {
  id: string;
  config: AgentConfig;
  protected logger: Logger;

  constructor(config: AgentConfig, logger?: Logger) {
    this.id = uuid();
    this.config = config;
    this.logger = logger || console as any;
  }

  abstract execute(input: AgentInput<In>): Promise<AgentOutput<Out>>;

  getName(): string {
    return this.config.name;
  }

  getVersion(): string {
    return this.config.version;
  }

  getId(): string {
    return this.id;
  }
}

// Export Agent class from Agent.ts
export { Agent } from './Agent.js';

// Export MCP integration classes
export { MCPServer } from './MCPServer.js';
export { MCPClient } from './MCPClient.js';
