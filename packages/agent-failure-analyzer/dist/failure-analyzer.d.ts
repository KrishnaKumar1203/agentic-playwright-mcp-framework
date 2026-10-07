import { Agent } from '@agents/agents-core';
export interface FailureAnalysis {
    testName: string;
    failureReason: string;
    errorType: string;
    suggestedFix: string;
    confidence: number;
    debugInfo: Record<string, any>;
}
export interface FailureAnalysisOutput {
    timestamp: Date;
    analyses: FailureAnalysis[];
    totalFailures: number;
    autoFixable: number;
    requiresManualReview: number;
}
/**
 * Automated Test Failure Analysis
 *
 * Analyzes test failures and provides AI-powered suggestions
 * Similar to debugging tools like error tracking systems
 * Can suggest automatic fixes or manual review steps
 *
 * Input: Test failure details, stack traces, logs
 * Process: Analyze error patterns, suggest fixes using ML
 * Output: Failure analysis with suggestions
 */
export declare class FailureAnalyzerAgent extends Agent {
    constructor();
    execute(input: any): Promise<any>;
    private analyzeFailure;
    private detectErrorType;
    private suggestFix;
    private extractReason;
}
//# sourceMappingURL=failure-analyzer.d.ts.map