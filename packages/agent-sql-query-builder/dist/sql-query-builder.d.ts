import { Agent } from '@agents/agents-core';
export interface SQLQuery {
    query: string;
    parameters?: Record<string, any>;
    tables?: string[];
    columns?: string[];
}
export interface ValidationResult {
    isValid: boolean;
    isSafe: boolean;
    queryType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'DROP' | 'CREATE' | 'ALTER' | 'UNKNOWN';
    riskLevel: 'safe' | 'warning' | 'critical';
    issues: ValidationIssue[];
    tables: string[];
    columns: string[];
    message: string;
}
export interface ValidationIssue {
    type: 'syntax' | 'security' | 'performance' | 'convention';
    severity: 'error' | 'warning' | 'info';
    message: string;
    suggestion?: string;
}
export interface SQLQueryBuilderOutput {
    timestamp: Date;
    validations: ValidationResult[];
    generatedQueries?: string[];
    safeQueryCount: number;
    blockedQueryCount: number;
}
/**
 * SQL Query Validator and Builder Agent
 *
 * Validates SQL queries to ensure they are SELECT-only (read operations)
 * Prevents any DELETE, INSERT, UPDATE, DROP commands
 * Generates safe SQL queries programmatically
 * Helps codegen agent create database queries safely
 *
 * Input: SQL queries to validate or query generation requests
 * Process: Parse, validate, check for dangerous commands
 * Output: Validation results and safe queries
 */
export declare class SQLQueryBuilderAgent extends Agent {
    private readonly FORBIDDEN_KEYWORDS;
    private readonly DANGEROUS_PATTERNS;
    constructor();
    execute(input: any): Promise<any>;
    /**
     * Validate a SQL query for safety and syntax
     */
    private validateQuery;
    /**
     * Detect the type of SQL query
     */
    private detectQueryType;
    /**
     * Extract tables used in query
     */
    private extractTables;
    /**
     * Extract columns from query
     */
    private extractColumns;
    /**
     * Calculate risk level based on query type and issues
     */
    private calculateRiskLevel;
    /**
     * Build a safe SQL query programmatically
     */
    private buildQuery;
    /**
     * Build WHERE clause safely
     */
    private buildWhereClause;
    /**
     * Escape SQL string values
     */
    private escapeSqlString;
}
//# sourceMappingURL=sql-query-builder.d.ts.map