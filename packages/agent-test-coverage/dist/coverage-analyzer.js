import { Agent } from '@agents/agents-core';
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
export class TestCoverageAgent extends Agent {
    constructor() {
        super('agent-test-coverage', '1.0.0');
    }
    async execute(input) {
        console.log(`[${this.name}] Analyzing test coverage...`);
        const requirements = input.requirements || [];
        const tests = input.tests || [];
        try {
            const coverageMap = this.mapTestsToRequirements(requirements, tests);
            const metrics = this.calculateMetrics(coverageMap);
            const gaps = this.identifyGaps(coverageMap);
            const output = {
                timestamp: new Date(),
                metrics,
                requirements: coverageMap,
                gaps,
            };
            console.log(`[${this.name}] Coverage: ${metrics.coveragePercentage}% (${metrics.coveredRequirements}/${metrics.totalRequirements})`);
            console.log(`[${this.name}] Found ${gaps.length} coverage gaps`);
            return {
                id: this.id,
                result: output,
                status: 'success',
                timestamp: new Date(),
            };
        }
        catch (error) {
            console.error(`[${this.name}] Coverage analysis failed:`, error);
            return {
                id: this.id,
                result: {
                    timestamp: new Date(),
                    metrics: {
                        totalRequirements: 0,
                        coveredRequirements: 0,
                        uncoveredRequirements: 0,
                        coveragePercentage: 0,
                        missingTests: []
                    },
                    requirements: [],
                    gaps: [],
                },
                status: 'failure',
                error: error,
                timestamp: new Date(),
            };
        }
    }
    mapTestsToRequirements(requirements, tests) {
        return requirements.map((req, index) => {
            const coveringTests = this.findCoveringTests(req, tests);
            return {
                requirementId: `REQ_${index + 1}`,
                requirementText: req,
                testsCovering: coveringTests,
                isCovered: coveringTests.length > 0,
                confidence: this.calculateConfidence(req, coveringTests),
            };
        });
    }
    findCoveringTests(requirement, tests) {
        // Extract keywords from requirement
        const keywords = this.extractKeywords(requirement);
        // Find tests that mention these keywords
        return tests.filter(test => {
            const testKeywords = this.extractKeywords(test);
            const matches = keywords.filter(kw => testKeywords.includes(kw));
            return matches.length > 0;
        });
    }
    extractKeywords(text) {
        // Extract important words (5+ chars, lowercase)
        return text
            .toLowerCase()
            .split(/\s+/)
            .filter(word => word.length >= 4)
            .slice(0, 10);
    }
    calculateConfidence(requirement, coveringTests) {
        if (coveringTests.length === 0)
            return 0;
        if (coveringTests.length === 1)
            return 0.7;
        if (coveringTests.length >= 3)
            return 0.95;
        return 0.85;
    }
    calculateMetrics(coverageMap) {
        const covered = coverageMap.filter(rc => rc.isCovered);
        const uncovered = coverageMap.filter(rc => !rc.isCovered);
        return {
            totalRequirements: coverageMap.length,
            coveredRequirements: covered.length,
            uncoveredRequirements: uncovered.length,
            coveragePercentage: Math.round((covered.length / coverageMap.length) * 100),
            missingTests: uncovered.map(rc => rc.requirementText),
        };
    }
    identifyGaps(coverageMap) {
        const gaps = [];
        coverageMap.forEach(req => {
            if (!req.isCovered) {
                gaps.push(`Missing tests for: ${req.requirementText}`);
            }
            else if (req.confidence < 0.7) {
                gaps.push(`Low confidence coverage for: ${req.requirementText} (${req.confidence * 100}%)`);
            }
        });
        return gaps;
    }
}
//# sourceMappingURL=coverage-analyzer.js.map