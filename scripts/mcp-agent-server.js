#!/usr/bin/env node

import { MCPServer } from '@agents/agents-core';
import { pathToFileURL } from 'node:url';

const agentTypes = {
  'agent-connector': 'ConnectorAgent',
  'agent-catalog': 'CatalogAgent',
  'agent-test-plan': 'VstpBuilder',
  'agent-explorer': 'ExplorerAgent',
  'agent-codegen': 'SpecGenerator',
  'agent-qa-gate': 'QaValidator',
  'agent-report-composer': 'ReportComposer',
};

async function start() {
  const [, , agentName, agentModulePath] = process.argv;
  const exportName = agentTypes[agentName];

  if (!exportName || !agentModulePath) {
    throw new Error(`Unknown or incomplete MCP agent configuration: ${agentName}`);
  }

  const agentModule = await import(pathToFileURL(agentModulePath).href);
  const AgentType = agentModule[exportName];
  if (typeof AgentType !== 'function') {
    throw new Error(`Agent module does not export ${exportName}: ${agentModulePath}`);
  }

  await new MCPServer(new AgentType()).start();
}

start().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
