import { Agent } from '@agents/agents-core';
export interface RequirementCoverage {
    requirementId: string;
    requirementText: string;
    testsCovering: string[];
    isCovered: boolean;
    confidence: number;
}
export interface CoverageMetrics {
    totalRequirements: number;
    coveredRequirements: number;
    uncoveredRequirements: number;
    coveragePercentage: number;
    missingTests: string[];
}
export interface TestCoverageOutput {
    timestamp: Date;
    metrics: CoverageMetrics;
    requirements: RequirementCoverage[];
    gaps: string[];
}
/**
 * Test Coverage and Requirement Traceability
 *
 * Validates that all requirements are covered by tests
 * Creates traceability matrix
 * Identifies coverage gaps
 *
 * Input: REQUIREMENTS.md, generated tests
 * Process: Map tests to requirements
 * Output: Coverage report with gaps
 */
export declare class TestCoverageAgent extends Agent {
    constructor();
    execute(input: any): Promise<any>;
    private mapTestsToRequirements;
    private findCoveringTests;
    private extractKeywords;
    private calculateConfidence;
    private calculateMetrics;
    private identifyGaps;
}
//# sourceMappingURL=coverage-analyzer.d.ts.map