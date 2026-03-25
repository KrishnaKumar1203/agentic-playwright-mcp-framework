import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequest,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { Agent } from './Agent.js';
import { AgentInput, AgentOutput } from './index.js';
import pino from 'pino';

/**
 * MCP Server Wrapper for Agents
 * Wraps any Agent to expose it as an MCP server via stdio
 */
export class MCPServer {
  private server: Server;
  private agent: Agent;
  private logger: pino.Logger;

  constructor(agent: Agent) {
    this.agent = agent;
    this.logger = pino({
      name: `mcp-server:${agent.getName()}`,
      level: process.env.LOG_LEVEL || 'info',
    });

    this.server = new Server(
      {
        name: `mcp-server-${agent.getName()}`,
        version: agent.getVersion(),
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List tools handler
    this.server.setRequestHandler(ListToolsRequest, async () => {
      this.logger.debug('Received ListTools request');
      return {
        tools: this.getToolDefinitions(),
      };
    });

    // Call tool handler (the main execution handler)
    this.server.setRequestHandler(
      CallToolRequest,
      async (request: CallToolRequestSchema) => {
        const { name, arguments: args } = request;
        this.logger.info({ tool: name, args }, 'Executing tool');

        try {
          if (name !== `${this.agent.getName()}_execute`) {
            return {
              content: [
                {
                  type: 'text',
                  text: `Unknown tool: ${name}`,
                },
              ],
              isError: true,
            };
          }

          // Execute the agent with provided arguments
          const agentInput: AgentInput = {
            taskId: args.taskId || `task-${Date.now()}`,
            payload: args.payload || args,
            metadata: args.metadata,
            timestamp: new Date(),
          };

          const result = await this.agent.execute(agentInput.payload);

          const agentOutput: AgentOutput = {
            id: this.agent.getId(),
            taskId: agentInput.taskId,
            result,
            status: 'success',
            timestamp: new Date(),
          };

          this.logger.info({ result: agentOutput }, 'Tool execution successful');

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(agentOutput, null, 2),
              },
            ],
          };
        } catch (error) {
          this.logger.error(
            { error: error instanceof Error ? error.message : String(error) },
            'Tool execution failed'
          );

          const agentOutput: AgentOutput = {
            id: this.agent.getId(),
            taskId: args.taskId || `task-${Date.now()}`,
            result: null,
            status: 'failure',
            error: error instanceof Error ? error : new Error(String(error)),
            timestamp: new Date(),
          };

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(agentOutput, null, 2),
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  private getToolDefinitions(): Tool[] {
    return [
      {
        name: `${this.agent.getName()}_execute`,
        description: `Execute the ${this.agent.getName()} agent. Version: ${this.agent.getVersion()}`,
        inputSchema: {
          type: 'object' as const,
          properties: {
            taskId: {
              type: 'string',
              description: 'Unique task identifier',
            },
            payload: {
              type: 'object',
              description: 'Agent input payload',
            },
            metadata: {
              type: 'object',
              description: 'Optional metadata',
            },
          },
          required: ['taskId', 'payload'],
        },
      },
    ];
  }

  public async start(): Promise<void> {
    this.logger.info(
      { agent: this.agent.getName(), version: this.agent.getVersion() },
      'Starting MCP server'
    );

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    this.logger.info('MCP server connected and ready');
  }
}
