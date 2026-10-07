import { Agent } from '@agents/agents-core';
import { faker } from '@faker-js/faker';
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
export class TestDataGeneratorAgent extends Agent {
    constructor() {
        super('agent-test-data', '1.0.0');
    }
    async execute(input) {
        console.log(`[${this.name}] Generating test data...`);
        const patterns = input.patterns || this.getDefaultPatterns();
        const count = input.count || 10;
        try {
            const datasets = this.generateDatasets(patterns, count);
            const output = {
                datasets,
                count: datasets.length,
                patterns,
                generatedAt: new Date(),
            };
            console.log(`[${this.name}] Generated ${datasets.length} test datasets`);
            return {
                id: this.id,
                result: output,
                status: 'success',
                timestamp: new Date(),
            };
        }
        catch (error) {
            console.error(`[${this.name}] Failed to generate test data:`, error);
            return {
                id: this.id,
                result: { datasets: [], count: 0, patterns: [], generatedAt: new Date() },
                status: 'failure',
                error: error,
                timestamp: new Date(),
            };
        }
    }
    getDefaultPatterns() {
        return [
            { fieldName: 'firstName', type: 'name' },
            { fieldName: 'lastName', type: 'name' },
            { fieldName: 'email', type: 'email' },
            { fieldName: 'phone', type: 'phone' },
            { fieldName: 'ssn', type: 'ssn' },
            { fieldName: 'accountId', type: 'accountId' },
            { fieldName: 'address', type: 'address' },
        ];
    }
    generateDatasets(patterns, count) {
        const datasets = [];
        // Generate normal test data
        for (let i = 0; i < count; i++) {
            const dataset = {};
            patterns.forEach(pattern => {
                dataset[pattern.fieldName] = this.generateValue(pattern);
            });
            datasets.push(dataset);
        }
        // Add edge case data
        datasets.push(this.getEdgeCaseData(patterns));
        datasets.push(this.getBoundaryData(patterns));
        return datasets;
    }
    generateValue(pattern) {
        switch (pattern.type) {
            case 'email':
                return faker.internet.email();
            case 'phone':
                return faker.phone.number('(###) ###-####');
            case 'ssn':
                return faker.string.numeric(9);
            case 'accountId':
                return 'ACC' + faker.string.numeric(8);
            case 'name':
                return faker.person.firstName();
            case 'address':
                return faker.location.streetAddress();
            case 'custom':
                return pattern.customGenerator ? pattern.customGenerator() : null;
            default:
                return faker.word.words(1);
        }
    }
    getEdgeCaseData(patterns) {
        const data = {};
        patterns.forEach(pattern => {
            switch (pattern.type) {
                case 'email':
                    data[pattern.fieldName] = 'test+special@example.com';
                    break;
                case 'phone':
                    data[pattern.fieldName] = '(000) 000-0000';
                    break;
                case 'ssn':
                    data[pattern.fieldName] = '000000000';
                    break;
                case 'name':
                    data[pattern.fieldName] = 'A'; // Minimum length
                    break;
                default:
                    data[pattern.fieldName] = '';
            }
        });
        return data;
    }
    getBoundaryData(patterns) {
        const data = {};
        patterns.forEach(pattern => {
            switch (pattern.type) {
                case 'email':
                    data[pattern.fieldName] = 'a'.repeat(64) + '@example.com'; // Max local part
                    break;
                case 'name':
                    data[pattern.fieldName] = 'A'.repeat(255); // Very long name
                    break;
                case 'ssn':
                    data[pattern.fieldName] = '999999999';
                    break;
                default:
                    data[pattern.fieldName] = faker.word.words(10);
            }
        });
        return data;
    }
}
//# sourceMappingURL=test-data-generator.js.map