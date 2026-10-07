import { Agent } from '@agents/agents-core';
export interface AIPlannerInput {
    userStory: string;
    requirements: string[];
    context?: Record<string, any>;
}
export interface TestCase {
    id: string;
    title: string;
    preconditions: string[];
    steps: string[];
    expectedResults: string[];
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}
export interface AIPlanOutput {
    planId: string;
    testCases: TestCase[];
    coverage: number;
    generatedAt: Date;
}
/**
 * AI-Powered Test Plan Generator
 *
 * Generates structured test plans from natural language requirements
 * using LLM (OpenAI, Anthropic, or other providers)
 *
 * Input: User stories, requirements
 * Process: Call LLM for test plan generation
 * Output: Structured VSTP format test plans
 */
export declare class AIPlannerAgent extends Agent {
    private apiKey;
    private llmProvider;
    constructor(llmProvider?: string);
    execute(input: AIPlannerInput): Promise<AIPlanOutput>;
    private createPrompt;
    private callLLM;
    private parseTestCases;
    private calculateCoverage;
}
//# sourceMappingURL=ai-planner.d.ts.map