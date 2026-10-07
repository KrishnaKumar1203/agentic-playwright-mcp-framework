import { Agent } from '@agents/agents-core';
export interface DataPattern {
    fieldName: string;
    type: 'email' | 'phone' | 'ssn' | 'accountId' | 'name' | 'address' | 'custom';
    pattern?: RegExp;
    customGenerator?: () => any;
}
export interface GeneratedData {
    [key: string]: any;
}
export interface TestDataOutput {
    datasets: GeneratedData[];
    count: number;
    patterns: DataPattern[];
    generatedAt: Date;
}
/**
 * Dynamic Test Data Generator
 *
 * Generates realistic test data without hardcoding
 * Supports multiple data types and patterns
 * Can generate edge cases and boundary values
 *
 * Input: Data patterns, count
 * Process: Generate realistic data using Faker.js
 * Output: JSON test datasets
 */
export declare class TestDataGeneratorAgent extends Agent {
    constructor();
    execute(input: any): Promise<any>;
    private getDefaultPatterns;
    private generateDatasets;
    private generateValue;
    private getEdgeCaseData;
    private getBoundaryData;
}
//# sourceMappingURL=test-data-generator.d.ts.map