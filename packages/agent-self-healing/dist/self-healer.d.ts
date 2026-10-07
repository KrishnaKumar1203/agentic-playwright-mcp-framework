import { Agent } from '@agents/agents-core';
export interface HealingStrategy {
    selector: string;
    alternatives: string[];
    confidence: number;
    reason: string;
}
export interface HealingResult {
    fixed: boolean;
    originalSelector: string;
    newSelector?: string;
    confidence: number;
    strategy: HealingStrategy;
}
export interface SelfHealingOutput {
    timestamp: Date;
    healedSelectors: HealingResult[];
    totalHealed: number;
    failedHeals: number;
}
/**
 * Advanced Self-Healing Agent
 *
 * Automatically detects and heals broken selectors
 * Uses multiple strategies: similarity matching, DOM analysis, ML patterns
 * Updates object repository automatically
 *
 * Input: Failed test selector, current DOM
 * Process: Find similar elements, calculate confidence, propose alternatives
 * Output: Healed selector or repair suggestions
 */
export declare class SelfHealingAgent extends Agent {
    constructor();
    execute(input: any): Promise<any>;
    private healSelector;
    private findSimilarSelectors;
    private findByAttributes;
    private findByText;
    private extractBase;
    private extractAttributes;
    private extractTextHint;
    private findAlternatives;
    private searchByAttributes;
    private searchByText;
}
//# sourceMappingURL=self-healer.d.ts.map