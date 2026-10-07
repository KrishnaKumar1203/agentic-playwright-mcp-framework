#!/usr/bin/env node

/**
 * MCP-Based Pipeline Script
 * Orchestrates the entire test automation pipeline using MCP agents
 * 
 * This script:
 * 1. Spawns each agent as an MCP server via stdio
 * 2. Communicates with agents using the MCP protocol
 * 3. Manages artifact generation from agent outputs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = pino({
  name: 'mcp-pipeline',
  level: process.env.LOG_LEVEL || 'info',
});

const ARTIFACTS_DIR = path.join(__dirname, '..', 'artifacts');
const RESOLVED_DIR = path.join(ARTIFACTS_DIR, 'resolved');
const VSTP_DIR = path.join(ARTIFACTS_DIR, 'vstp');
const OBJECT_REPO_DIR = path.join(ARTIFACTS_DIR, 'object-repository');
const QA_GATE_DIR = path.join(ARTIFACTS_DIR, 'qa-gate');
const REPORTS_DIR = path.join(ARTIFACTS_DIR, 'reports');
const LOGS_DIR = path.join(ARTIFACTS_DIR, 'logs');

/**
 * Define all agents in the pipeline
 * Each agent is configured to run as an MCP server
 */
const pipelineAgents = [
  {
    name: 'Connection Resolution',
    agentName: 'agent-connector',
    agentPath: '../packages/agent-connector/dist/connector.js',
    outputDir: RESOLVED_DIR,
    outputFile: 'connection-config.json',
  },
  {
    name: 'Service Catalog',
    agentName: 'agent-catalog',
    agentPath: '../packages/agent-catalog/dist/catalog-agent.js',
    outputDir: RESOLVED_DIR,
    outputFile: 'catalog.json',
  },
  {
    name: 'VSTP Building',
    agentName: 'agent-test-plan',
    agentPath: '../packages/agent-test-plan/dist/vstp-builder.js',
    outputDir: VSTP_DIR,
    outputFile: 'test-plan.vstp.json',
  },
  {
    name: 'Element Discovery',
    agentName: 'agent-explorer',
    agentPath: '../packages/agent-explorer/dist/explorer-agent.js',
    outputDir: OBJECT_REPO_DIR,
    outputFile: 'elements.json',
  },
  {
    name: 'Code Generation',
    agentName: 'agent-codegen',
    agentPath: '../packages/agent-codegen/dist/spec-generator.js',
    outputDir: path.join(__dirname, '..', 'apps', 'example-webapp-tests', 'tests', 'generated'),
    outputFile: 'generated-specs.json',
  },
  {
    name: 'QA Gate Validation',
    agentName: 'agent-qa-gate',
    agentPath: '../packages/agent-qa-gate/dist/qa-validator.js',
    outputDir: QA_GATE_DIR,
    outputFile: 'qa-gate-report.json',
  },
  {
    name: 'Report Composition',
    agentName: 'agent-report-composer',
    agentPath: '../packages/agent-report-composer/dist/report-composer.js',
    outputDir: REPORTS_DIR,
    outputFile: 'summary.json',
  },
];

async function runMCPPipeline() {
  logger.info('🚀 Starting MCP-Based Agentic Playwright Pipeline...\n');

  try {
    // Validate that agents are built
    logger.info('Checking agent builds...');
    validateAgentBuilds();

    // Create pipeline log
    const pipelineLog = {
      startTime: new Date(),
      agents: [],
      status: 'running',
    };

    // Execute each agent in the pipeline
    for (const agent of pipelineAgents) {
      logger.info({ agent: agent.agentName }, `\n📋 ${agent.name}...`);

      try {
        const result = await executeAgentViaMCP(
          agent.agentName,
          agent.agentPath,
          {
            taskId: `task-${agent.agentName}-${Date.now()}`,
            payload: { step: agent.name },
          }
        );

        // Save output to artifact
        await saveArtifact(agent.outputDir, agent.outputFile, result);

        pipelineLog.agents.push({
          name: agent.agentName,
          status: 'success',
          timestamp: new Date(),
        });

        logger.info({ agent: agent.agentName }, `✅ ${agent.name} complete`);
      } catch (error) {
        logger.error(
          { agent: agent.agentName, error: error instanceof Error ? error.message : String(error) },
          `❌ ${agent.name} failed`
        );

        pipelineLog.agents.push({
          name: agent.agentName,
          status: 'failure',
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date(),
        });

        // Continue with next agent (non-blocking failure)
      }
    }

    // Save pipeline log
    const hasFailures = pipelineLog.agents.some((agent) => agent.status === 'failure');
    pipelineLog.status = hasFailures ? 'failed' : 'completed';
    pipelineLog.endTime = new Date();
    await saveArtifact(LOGS_DIR, 'pipeline-execution.json', pipelineLog);

    logger.info(`\n${hasFailures ? '⚠️ MCP Pipeline completed with failures.' : '✨ MCP Pipeline execution completed!'}`);
    logger.info(`📁 Artifacts saved to: ${ARTIFACTS_DIR}`);
    logger.info(`📝 Pipeline log: ${path.join(LOGS_DIR, 'pipeline-execution.json')}`);
    if (hasFailures) {
      process.exitCode = 1;
    }
  } catch (error) {
    logger.error({ error: error instanceof Error ? error.message : String(error) }, '❌ Pipeline failed');
    process.exit(1);
  }
}

/**
 * Execute an agent via MCP protocol
 */
async function executeAgentViaMCP(agentName, agentPath, input) {
  const { MCPClient } = await import('@agents/agents-core');

  const client = new MCPClient(
    agentName,
    path.join(__dirname, 'mcp-agent-server.js'),
    [agentName, path.resolve(__dirname, agentPath)]
  );

  try {
    await client.connect();
    logger.debug({ agent: agentName }, 'MCP client connected');

    const result = await client.callTool(
      input.taskId,
      input.payload,
      { agent: agentName }
    );

    logger.debug({ agent: agentName, result }, 'Agent execution result');
    return result;
  } finally {
    await client.disconnect();
  }
}

/**
 * Validate that all agents are built
 */
function validateAgentBuilds() {
  for (const agent of pipelineAgents) {
    const agentPath = path.resolve(__dirname, agent.agentPath);
    if (!fs.existsSync(agentPath)) {
      throw new Error(
        `Agent build not found: ${agentPath}\n` +
        'Please run: npm run build'
      );
    }
  }
  logger.info('✓ All agent builds validated');
}

/**
 * Save artifact output
 */
async function saveArtifact(dir, filename, content) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filepath = path.join(dir, filename);
  fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
  logger.debug({ filepath }, 'Artifact saved');
}

// Run the pipeline
runMCPPipeline().catch(error => {
  logger.fatal(error, 'Pipeline execution failed');
  process.exit(1);
});
