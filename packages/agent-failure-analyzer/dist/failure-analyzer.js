import { Agent } from '@agents/agents-core';
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
export class FailureAnalyzerAgent extends Agent {
    constructor() {
        super('agent-failure-analyzer', '1.0.0');
    }
    async execute(input) {
        console.log(`[${this.name}] Analyzing test failures...`);
        const failures = input.failures || [];
        try {
            const analyses = [];
            for (const failure of failures) {
                const analysis = await this.analyzeFailure(failure);
                analyses.push(analysis);
            }
            const autoFixable = analyses.filter(a => a.confidence > 0.8).length;
            const requiresReview = analyses.filter(a => a.confidence <= 0.8).length;
            const output = {
                timestamp: new Date(),
                analyses,
                totalFailures: analyses.length,
                autoFixable,
                requiresManualReview: requiresReview,
            };
            console.log(`[${this.name}] Analyzed ${analyses.length} failures (${autoFixable} auto-fixable)`);
            return {
                id: this.id,
                result: output,
                status: 'success',
                timestamp: new Date(),
            };
        }
        catch (error) {
            console.error(`[${this.name}] Analysis failed:`, error);
            return {
                id: this.id,
                result: {
                    timestamp: new Date(),
                    analyses: [],
                    totalFailures: 0,
                    autoFixable: 0,
                    requiresManualReview: 0
                },
                status: 'failure',
                error: error,
                timestamp: new Date(),
            };
        }
    }
    async analyzeFailure(failure) {
        const errorMessage = failure.error || '';
        const stackTrace = failure.stackTrace || '';
        const testName = failure.testName || 'Unknown';
        console.log(`[${this.name}] Analyzing failure: ${testName}`);
        // Detect error type
        const errorType = this.detectErrorType(errorMessage, stackTrace);
        // Suggest fix based on error type
        const { suggestedFix, confidence } = this.suggestFix(errorType, errorMessage);
        // Get failure reason
        const failureReason = this.extractReason(errorMessage);
        return {
            testName,
            failureReason,
            errorType,
            suggestedFix,
            confidence,
            debugInfo: {
                originalError: errorMessage,
                stackTrace,
                timestamp: new Date(),
            },
        };
    }
    detectErrorType(error, stackTrace) {
        const lowerError = error.toLowerCase();
        if (lowerError.includes('element not found') || lowerError.includes('timeout waiting')) {
            return 'SELECTOR_TIMEOUT';
        }
        if (lowerError.includes('assertion failed') || lowerError.includes('expected')) {
            return 'ASSERTION_FAILED';
        }
        if (lowerError.includes('network') || lowerError.includes('connection')) {
            return 'NETWORK_ERROR';
        }
        if (lowerError.includes('permission') || lowerError.includes('unauthorized')) {
            return 'AUTH_ERROR';
        }
        if (lowerError.includes('page crashed') || lowerError.includes('browser closed')) {
            return 'BROWSER_CRASH';
        }
        return 'UNKNOWN_ERROR';
    }
    suggestFix(errorType, errorMessage) {
        switch (errorType) {
            case 'SELECTOR_TIMEOUT':
                return {
                    suggestedFix: 'Increase timeout or update selector. Element may have moved. Run agent-dom-analyzer.',
                    confidence: 0.9,
                };
            case 'ASSERTION_FAILED':
                return {
                    suggestedFix: 'Review assertion logic. Expected vs actual values may have changed.',
                    confidence: 0.85,
                };
            case 'NETWORK_ERROR':
                return {
                    suggestedFix: 'Check network connectivity and API endpoints. Retry with exponential backoff.',
                    confidence: 0.8,
                };
            case 'AUTH_ERROR':
                return {
                    suggestedFix: 'Verify credentials and token validity. Check if credentials have expired.',
                    confidence: 0.88,
                };
            case 'BROWSER_CRASH':
                return {
                    suggestedFix: 'Browser crashed. Retry test. May indicate memory leak or resource issue.',
                    confidence: 0.7,
                };
            default:
                return {
                    suggestedFix: 'Review error logs and test context. May require manual investigation.',
                    confidence: 0.5,
                };
        }
    }
    extractReason(errorMessage) {
        // Extract key part of error message
        const lines = errorMessage.split('\n');
        return lines[0] || 'Unknown error';
    }
}
//# sourceMappingURL=failure-analyzer.js.map