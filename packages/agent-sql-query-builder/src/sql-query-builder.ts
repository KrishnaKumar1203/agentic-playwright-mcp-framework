import { Agent } from '@agents/agents-core';
import { v4 as uuidv4 } from 'uuid';

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
export class SQLQueryBuilderAgent extends Agent {
  private readonly FORBIDDEN_KEYWORDS = [
    'DELETE',
    'INSERT',
    'UPDATE',
    'DROP',
    'CREATE',
    'ALTER',
    'TRUNCATE',
    'GRANT',
    'REVOKE',
    'EXEC',
    'EXECUTE',
  ];

  private readonly DANGEROUS_PATTERNS = [
    /;\s*DROP/gi,
    /;\s*DELETE/gi,
    /;\s*INSERT/gi,
    /;\s*UPDATE/gi,
    /;\s*ALTER/gi,
  ];

  constructor() {
    super('agent-sql-query-builder', '1.0.0');
  }

  async execute(input: any): Promise<any> {
    console.log(`[${this.name}] Validating SQL queries...`);
    
    const queries = input.queries || [];
    const buildRequest = input.buildRequest;

    try {
      const validations: ValidationResult[] = [];
      const generatedQueries: string[] = [];
      let safeCount = 0;
      let blockedCount = 0;

      // Validate existing queries
      for (const query of queries) {
        const validation = this.validateQuery(query);
        validations.push(validation);
        
        if (validation.isSafe) {
          safeCount++;
        } else {
          blockedCount++;
        }
      }

      // Generate safe queries from request
      if (buildRequest) {
        const generated = this.buildQuery(buildRequest);
        if (generated) {
          generatedQueries.push(generated);
          if (this.validateQuery(generated).isSafe) {
            safeCount++;
          }
        }
      }

      const output: SQLQueryBuilderOutput = {
        timestamp: new Date(),
        validations,
        generatedQueries: generatedQueries.length > 0 ? generatedQueries : undefined,
        safeQueryCount: safeCount,
        blockedQueryCount: blockedCount,
      };

      console.log(`[${this.name}] Validation complete: ${safeCount} safe, ${blockedCount} blocked`);
      
      return {
        id: this.id,
        result: output,
        status: 'success',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`[${this.name}] Validation failed:`, error);
      
      return {
        id: this.id,
        result: { 
          timestamp: new Date(), 
          validations: [], 
          safeQueryCount: 0, 
          blockedQueryCount: 0 
        },
        status: 'failure',
        error: error as Error,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Validate a SQL query for safety and syntax
   */
  private validateQuery(query: string): ValidationResult {
    const issues: ValidationIssue[] = [];
    const normalizedQuery = query.trim().toUpperCase();

    // Detect query type
    const queryType = this.detectQueryType(normalizedQuery);

    // Check for forbidden commands
    if (queryType !== 'SELECT') {
      issues.push({
        type: 'security',
        severity: 'error',
        message: `Only SELECT queries are allowed. Found ${queryType} command.`,
        suggestion: 'Convert this to a SELECT query or use a read-only operation.',
      });
    }

    // Check for dangerous patterns (injection attempts, stacked queries)
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(query)) {
        issues.push({
          type: 'security',
          severity: 'error',
          message: 'Detected dangerous query pattern (potential SQL injection)',
          suggestion: 'Use parameterized queries and avoid concatenation.',
        });
      }
    }

    // Check for common security issues
    if (/['";\\]/g.test(query) && !query.includes('?')) {
      issues.push({
        type: 'security',
        severity: 'warning',
        message: 'Query contains special characters without parameterization',
        suggestion: 'Use parameterized queries with ? or named parameters',
      });
    }

    // Check for performance issues
    if (normalizedQuery.includes('SELECT *')) {
      issues.push({
        type: 'performance',
        severity: 'warning',
        message: 'SELECT * is inefficient - specify required columns',
        suggestion: 'Replace * with specific column names: SELECT id, name, email FROM users',
      });
    }

    if (!normalizedQuery.includes('LIMIT') && normalizedQuery.includes('JOIN')) {
      issues.push({
        type: 'performance',
        severity: 'info',
        message: 'Consider adding LIMIT to JOIN queries for safety',
        suggestion: 'Add LIMIT clause: ... LIMIT 1000',
      });
    }

    // Extract tables and columns
    const tables = this.extractTables(query);
    const columns = this.extractColumns(query);

    // Determine safety
    const isSafe = queryType === 'SELECT' && issues.filter(i => i.severity === 'error').length === 0;
    const riskLevel = this.calculateRiskLevel(queryType, issues);

    return {
      isValid: issues.length === 0,
      isSafe,
      queryType,
      riskLevel,
      issues,
      tables,
      columns,
      message: isSafe ? 'Query is safe to execute' : `Query blocked: ${issues[0]?.message || 'Unknown issue'}`,
    };
  }

  /**
   * Detect the type of SQL query
   */
  private detectQueryType(query: string): 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'DROP' | 'CREATE' | 'ALTER' | 'UNKNOWN' {
    for (const keyword of this.FORBIDDEN_KEYWORDS) {
      if (query.startsWith(keyword)) {
        return keyword as any;
      }
    }

    if (query.startsWith('SELECT')) {
      return 'SELECT';
    }

    return 'UNKNOWN';
  }

  /**
   * Extract tables used in query
   */
  private extractTables(query: string): string[] {
    const tables: string[] = [];
    
    // Simple pattern matching for FROM and JOIN clauses
    const fromPattern = /FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi;
    const joinPattern = /JOIN\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi;

    let match;
    while ((match = fromPattern.exec(query)) !== null) {
      tables.push(match[1]);
    }

    while ((match = joinPattern.exec(query)) !== null) {
      tables.push(match[1]);
    }

    return [...new Set(tables)]; // Remove duplicates
  }

  /**
   * Extract columns from query
   */
  private extractColumns(query: string): string[] {
    const columns: string[] = [];

    // If SELECT *, don't extract specific columns
    if (query.includes('SELECT *')) {
      return [];
    }

    // Extract columns between SELECT and FROM
    const selectPattern = /SELECT\s+(.*?)\s+FROM/is;
    const match = selectPattern.exec(query);
    
    if (match) {
      const columnList = match[1];
      // Split by comma and clean up
      const cols = columnList.split(',').map(col => {
        return col.trim()
          .replace(/\[([^\]]+)\]/g, '$1') // Remove brackets
          .replace(/`([^`]+)`/g, '$1') // Remove backticks
          .replace(/AS\s+[a-zA-Z_][a-zA-Z0-9_]*/gi, '') // Remove alias
          .trim();
      }).filter(col => col.length > 0);

      return cols;
    }

    return columns;
  }

  /**
   * Calculate risk level based on query type and issues
   */
  private calculateRiskLevel(queryType: string, issues: ValidationIssue[]): 'safe' | 'warning' | 'critical' {
    if (queryType !== 'SELECT') {
      return 'critical';
    }

    const errorCount = issues.filter(i => i.severity === 'error').length;
    if (errorCount > 0) {
      return 'critical';
    }

    const warningCount = issues.filter(i => i.severity === 'warning').length;
    if (warningCount > 0) {
      return 'warning';
    }

    return 'safe';
  }

  /**
   * Build a safe SQL query programmatically
   */
  private buildQuery(request: any): string | null {
    try {
      const { type, tables, columns, where, orderBy, limit } = request;

      if (type !== 'SELECT') {
        console.warn(`[${this.name}] Only SELECT queries can be built. Requested: ${type}`);
        return null;
      }

      if (!tables || !Array.isArray(tables) || tables.length === 0) {
        console.error(`[${this.name}] At least one table is required`);
        return null;
      }

      // Build SELECT clause
      const columnList = columns && columns.length > 0 ? columns.join(', ') : '*';
      let query = `SELECT ${columnList} FROM ${tables[0]}`;

      // Add JOINs for multiple tables
      if (tables.length > 1) {
        for (let i = 1; i < tables.length; i++) {
          query += ` JOIN ${tables[i]} ON ${tables[i]}.id = ${tables[0]}.id`;
        }
      }

      // Add WHERE clause
      if (where) {
        query += ` WHERE ${this.buildWhereClause(where)}`;
      }

      // Add ORDER BY
      if (orderBy) {
        query += ` ORDER BY ${orderBy.column} ${orderBy.direction || 'ASC'}`;
      }

      // Add LIMIT (always included for safety)
      const limitValue = limit || 1000;
      query += ` LIMIT ${limitValue}`;

      return query;
    } catch (error) {
      console.error(`[${this.name}] Failed to build query:`, error);
      return null;
    }
  }

  /**
   * Build WHERE clause safely
   */
  private buildWhereClause(where: any): string {
    if (typeof where === 'string') {
      return where;
    }

    if (typeof where === 'object') {
      const conditions = Object.entries(where).map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key} = '${this.escapeSqlString(value)}'`;
        }
        return `${key} = ${value}`;
      });
      return conditions.join(' AND ');
    }

    return '1=1'; // Safe default
  }

  /**
   * Escape SQL string values
   */
  private escapeSqlString(str: string): string {
    return str.replace(/'/g, "''").replace(/"/g, '""');
  }
}
