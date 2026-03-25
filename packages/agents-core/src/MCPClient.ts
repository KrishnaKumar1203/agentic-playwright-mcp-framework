import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import pino from 'pino';
import { spawn, ChildProcess } from 'child_process';
import { AgentOutput } from './index.js';

/**
 * MCP Client for calling agents via MCP protocol
 * Handles agent process lifecycle and communication
 */
export class MCPClient {
  private client: Client | null = null;
  private process: ChildProcess | null = null;
  private logger: pino.Logger;
  private agentName: string;
  private agentPath: string;

  constructor(agentName: string, agentPath: string) {
    this.agentName = agentName;
    this.agentPath = agentPath;
    this.logger = pino({
      name: `mcp-client:${agentName}`,
      level: process.env.LOG_LEVEL || 'info',
    });
  }

  /**
   * Connect to MCP agent server
   */
  public async connect(): Promise<void> {
    this.logger.info(
      { agentName: this.agentName, agentPath: this.agentPath },
      'Connecting to MCP agent'
    );

    try {
      // Spawn the agent process
      this.process = spawn('node', [this.agentPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          LOG_LEVEL: process.env.LOG_LEVEL || 'info',
        },
      });

      if (!this.process.stdin || !this.process.stdout) {
        throw new Error('Failed to create stdin/stdout pipes for agent');
      }

      // Create MCP client with stdio transport
      const transport = new StdioClientTransport({
        stdin: this.process.stdin,
        stdout: this.process.stdout,
      });

      this.client = new Client(
        {
          name: `client-for-${this.agentName}`,
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      await this.client.connect(transport);
      this.logger.info('MCP client connected');

      // Handle process errors
      this.process.on('error', (error) => {
        this.logger.error({ error: error.message }, 'Agent process error');
      });

      this.process.on('exit', (code, signal) => {
        this.logger.warn({ code, signal }, 'Agent process exited');
        this.client = null;
      });
    } catch (error) {
      this.logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Failed to connect to MCP agent'
      );
      throw error;
    }
  }

  /**
   * Call agent tool via MCP
   */
  public async callTool(
    taskId: string,
    payload: any,
    metadata?: Record<string, any>
  ): Promise<AgentOutput> {
    if (!this.client) {
      throw new Error(`MCP client not connected for agent: ${this.agentName}`);
    }

    const toolName = `${this.agentName}_execute`;

    this.logger.debug({ taskId, toolName }, 'Calling tool via MCP');

    try {
      const response = await this.client.callTool({
        name: toolName,
        arguments: {
          taskId,
          payload,
          metadata,
        },
      });

      // Parse the response
      if (response.content.length === 0) {
        throw new Error('No response content from agent');
      }

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error(`Unexpected response type: ${content.type}`);
      }

      const result = JSON.parse(content.text) as AgentOutput;
      this.logger.debug({ result }, 'Tool call successful');
      return result;
    } catch (error) {
      this.logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Tool call failed'
      );

      return {
        id: '',
        taskId,
        result: null,
        status: 'failure',
        error: error instanceof Error ? error : new Error(String(error)),
        timestamp: new Date(),
      };
    }
  }

  /**
   * Disconnect from agent
   */
  public async disconnect(): Promise<void> {
    this.logger.info('Disconnecting from MCP agent');

    if (this.client) {
      try {
        // The client will close the transport
        this.client = null;
      } catch (error) {
        this.logger.error('Error closing MCP client');
      }
    }

    if (this.process) {
      try {
        this.process.kill();
        this.process = null;
      } catch (error) {
        this.logger.error('Error killing agent process');
      }
    }
  }

  /**
   * Check if client is connected
   */
  public isConnected(): boolean {
    return this.client !== null && this.process !== null;
  }
}
