import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import pino from 'pino';
import { CallToolResultSchema } from '@modelcontextprotocol/sdk/types.js';
import { AgentOutput } from './index.js';

/**
 * MCP Client for calling agents via MCP protocol
 * Handles agent process lifecycle and communication
 */
export class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private logger: pino.Logger;
  private agentName: string;
  private agentPath: string;
  private serverArgs: string[];

  constructor(agentName: string, agentPath: string, serverArgs: string[] = []) {
    this.agentName = agentName;
    this.agentPath = agentPath;
    this.serverArgs = serverArgs;
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
      const env = Object.fromEntries(
        Object.entries(process.env).filter(
          (entry): entry is [string, string] => entry[1] !== undefined
        )
      );
      this.transport = new StdioClientTransport({
        command: process.execPath,
        args: [this.agentPath, ...this.serverArgs],
        env: {
          ...env,
          LOG_LEVEL: process.env.LOG_LEVEL || 'info',
        },
      });
      this.transport.onerror = (error) => {
        this.logger.error({ error: error.message }, 'Agent transport error');
      };
      this.transport.onclose = () => {
        this.client = null;
        this.transport = null;
      };

      this.client = new Client(
        {
          name: `client-for-${this.agentName}`,
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      await this.client.connect(this.transport);
      this.logger.info('MCP client connected');
    } catch (error) {
      const transport = this.transport;
      this.client = null;
      this.transport = null;
      if (transport) {
        try {
          await transport.close();
        } catch (cleanupError) {
          this.logger.error(
            {
              error:
                cleanupError instanceof Error
                  ? cleanupError.message
                  : String(cleanupError),
            },
            'Failed to close agent transport after connection error'
          );
        }
      }
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
      }, CallToolResultSchema);

      // Parse the response
      if (!Array.isArray(response.content) || response.content.length === 0) {
        throw new Error('No response content from agent');
      }

      const content = response.content[0];
      if (
        typeof content !== 'object' ||
        content === null ||
        !('type' in content) ||
        content.type !== 'text' ||
        !('text' in content) ||
        typeof content.text !== 'string'
      ) {
        throw new Error('Unexpected response content from agent');
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

    const client = this.client;
    const transport = this.transport;
    this.client = null;
    this.transport = null;

    if (client) {
      try {
        await client.close();
      } catch (error) {
        this.logger.error(
          { error: error instanceof Error ? error.message : String(error) },
          'Error closing MCP client'
        );
        throw error;
      }
    } else if (transport) {
      try {
        await transport.close();
      } catch (error) {
        this.logger.error(
          { error: error instanceof Error ? error.message : String(error) },
          'Error closing agent transport'
        );
        throw error;
      }
    }
  }

  /**
   * Check if client is connected
   */
  public isConnected(): boolean {
    return this.client !== null && this.transport !== null;
  }
}
