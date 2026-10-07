import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import pino from 'pino';
function isRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
/**
 * MCP Server Wrapper for Agents
 * Wraps any Agent to expose it as an MCP server via stdio
 */
export class MCPServer {
    constructor(agent) {
        this.agent = agent;
        this.logger = pino({
            name: `mcp-server:${agent.getName()}`,
            level: process.env.LOG_LEVEL || 'info',
        }, pino.destination(2));
        this.server = new Server({
            name: `mcp-server-${agent.getName()}`,
            version: agent.getVersion(),
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupHandlers();
    }
    setupHandlers() {
        // List tools handler
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            this.logger.debug('Received ListTools request');
            return {
                tools: this.getToolDefinitions(),
            };
        });
        // Call tool handler (the main execution handler)
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args = {} } = request.params;
            const taskId = typeof args.taskId === 'string' && args.taskId.length > 0
                ? args.taskId
                : `task-${Date.now()}`;
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
                const agentInput = {
                    taskId,
                    payload: args.payload || args,
                    metadata: isRecord(args.metadata) ? args.metadata : undefined,
                    timestamp: new Date(),
                };
                const result = await this.agent.execute(agentInput.payload);
                const agentOutput = {
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
            }
            catch (error) {
                this.logger.error({ error: error instanceof Error ? error.message : String(error) }, 'Tool execution failed');
                const agentOutput = {
                    id: this.agent.getId(),
                    taskId,
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
        });
    }
    getToolDefinitions() {
        return [
            {
                name: `${this.agent.getName()}_execute`,
                description: `Execute the ${this.agent.getName()} agent. Version: ${this.agent.getVersion()}`,
                inputSchema: {
                    type: 'object',
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
    async start() {
        this.logger.info({ agent: this.agent.getName(), version: this.agent.getVersion() }, 'Starting MCP server');
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        this.logger.info('MCP server connected and ready');
    }
}
//# sourceMappingURL=MCPServer.js.map