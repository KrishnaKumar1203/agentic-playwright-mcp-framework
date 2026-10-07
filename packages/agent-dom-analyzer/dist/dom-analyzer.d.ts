import { Agent } from '@agents/agents-core';
export interface DOMElement {
    selector: string;
    tag: string;
    text: string;
    attributes: Record<string, string>;
}
export interface DOMDiff {
    type: 'added' | 'removed' | 'modified';
    element: DOMElement;
    oldValue?: string;
    newValue?: string;
    severity: 'critical' | 'major' | 'minor';
}
export interface DomAnalysisOutput {
    timestamp: Date;
    diffs: DOMDiff[];
    breakingChanges: number;
    warnings: string[];
}
/**
 * DOM Change Detection and Analysis
 *
 * Detects changes in DOM structure between two states
 * Identifies breaking changes and selector updates needed
 * Feeds into self-healing agent
 *
 * Input: Old DOM, New DOM
 * Process: Compare DOM structures
 * Output: Diff report with change recommendations
 */
export declare class DomAnalyzerAgent extends Agent {
    constructor();
    execute(input: any): Promise<any>;
    private analyzeDifferences;
    private isSameElement;
    private hasChanges;
    private getSeverity;
    private generateWarnings;
}
//# sourceMappingURL=dom-analyzer.d.ts.map