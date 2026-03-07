# SQL Query Builder Agent

Safe SQL query validation and generation agent that enforces SELECT-only operations.

## Purpose

This agent validates SQL queries to ensure they are read-only (SELECT) operations and prevents any data modification commands. It helps the code generation agent create safe, secure database queries.

## Key Features

✅ **SELECT-Only Enforcement** - Blocks DELETE, INSERT, UPDATE, DROP, CREATE, ALTER commands  
✅ **Query Validation** - Syntax and security validation  
✅ **Safe Query Generation** - Programmatically build secure SQL queries  
✅ **Parameterization Checks** - Warns about SQL injection risks  
✅ **Performance Analysis** - Identifies inefficient query patterns  
✅ **Table & Column Extraction** - Parses query structure  

## Integration

This agent integrates with **agent-codegen** to:
- Validate database queries before code generation
- Generate safe SQL queries for test data setup
- Ensure compliance with read-only database policies
- Prevent accidental data modification in test environments

## Input Format

### Validate Existing Queries
```json
{
  "queries": [
    "SELECT id, name FROM users WHERE age > 18",
    "UPDATE users SET status = 'active'" // This will be blocked!
  ]
}
```

### Generate New Safe Query
```json
{
  "buildRequest": {
    "type": "SELECT",
    "tables": ["users"],
    "columns": ["id", "name", "email"],
    "where": { "age": 18 },
    "orderBy": { "column": "created_at", "direction": "DESC" },
    "limit": 100
  }
}
```

## Output Format

### Validation Result
```json
{
  "isValid": true,
  "isSafe": true,
  "queryType": "SELECT",
  "riskLevel": "safe",
  "issues": [],
  "tables": ["users"],
  "columns": ["id", "name"],
  "message": "Query is safe to execute"
}
```

### With Issues (e.g., DELETE command)
```json
{
  "isValid": false,
  "isSafe": false,
  "queryType": "DELETE",
  "riskLevel": "critical",
  "issues": [
    {
      "type": "security",
      "severity": "error",
      "message": "Only SELECT queries are allowed. Found DELETE command.",
      "suggestion": "Convert this to a SELECT query or use a read-only operation."
    }
  ],
  "tables": ["users"],
  "columns": [],
  "message": "Query blocked: Only SELECT queries are allowed. Found DELETE command."
}
```

## Query Type Detection

The agent detects and blocks:

### Forbidden Commands ❌
- **DELETE** - Data deletion
- **INSERT** - Data insertion
- **UPDATE** - Data modification
- **DROP** - Table/database deletion
- **CREATE** - Table/database creation
- **ALTER** - Schema modification
- **TRUNCATE** - Table truncation
- **GRANT/REVOKE** - Permission changes
- **EXEC/EXECUTE** - Dynamic execution

### Allowed Commands ✅
- **SELECT** - Data retrieval only
- **WITH** - Common Table Expressions (read-only)

## Security Features

### SQL Injection Prevention
- Detects unparameterized special characters
- Warns about concatenation without parameterization
- Suggests parameterized query approach

### Stacked Query Prevention
- Detects multiple statements separated by semicolons
- Blocks secondary dangerous commands

### Pattern-Based Detection
- Regular expressions match dangerous patterns
- Case-insensitive matching
- Whitespace-tolerant patterns

## Performance Checks

### Warning Cases
- `SELECT *` - Recommends specific column selection
- Unoptimized JOINs - Suggests LIMIT clause
- Missing indexing hints - Recommends query optimization

## Safe Query Building

### Programmatic Query Building
```typescript
const query = {
  type: 'SELECT',
  tables: ['users'],
  columns: ['id', 'email', 'name'],
  where: { status: 'active', age: { '>': 18 } },
  orderBy: { column: 'created_at', direction: 'DESC' },
  limit: 500
};
// Generates: SELECT id, email, name FROM users WHERE status = 'active' AND age > 18 ORDER BY created_at DESC LIMIT 500
```

## Usage in Code Generation

The codegen agent uses this validation when generating test database queries:

```typescript
// In agent-codegen
const sqlValidator = new SQLQueryBuilderAgent();
const validation = await sqlValidator.execute({
  queries: [generatedDatabaseQuery]
});

if (validation.result.validations[0].isSafe) {
  // Safe to use in generated code
  testCode += generatedDatabaseQuery;
} else {
  // Log issue and skip
  console.warn(validation.result.validations[0].message);
}
```

## Configuration

No special configuration required. The agent applies security rules automatically:
- All non-SELECT queries are rejected
- All dangerous commands are blocked
- Performance warnings are advisory only

## Example Usage

### Scenario 1: Developer tries to generate data cleanup test
```json
Input:
{
  "queries": ["DELETE FROM test_users WHERE created_at < NOW() - INTERVAL 30 DAY"]
}

Output:
{
  "isSafe": false,
  "riskLevel": "critical",
  "message": "Query blocked: Only SELECT queries are allowed. Found DELETE command."
}
```

### Scenario 2: Agent generates safe test query
```json
Input:
{
  "buildRequest": {
    "type": "SELECT",
    "tables": ["users"],
    "columns": ["id", "email"],
    "where": { "organization_id": 123 },
    "limit": 100
  }
}

Generated Query:
"SELECT id, email FROM users WHERE organization_id = 123 LIMIT 100"

Output:
{
  "isSafe": true,
  "riskLevel": "safe",
  "message": "Query is safe to execute"
}
```

## Best Practices

1. **Always Use Parameterization** - Pass parameters separately, not in query string
2. **Specify Columns** - Avoid `SELECT *` for performance
3. **Set Limits** - Always include LIMIT clause in SELECT queries
4. **Use WHERE Clauses** - Narrow results to specific records
5. **Test in QA First** - Validate queries in non-production environment

## Error Handling

- Malformed SQL: Returns validation errors
- Missing tables: Requires at least one table
- Invalid query type: Rejects non-SELECT generation requests
- Failed parsing: Returns error status with details

## Related Agents

- **agent-codegen** - Generates Playwright test code (validates SQL with this agent)
- **agent-test-data** - Generates test data (uses SELECT queries)
- **agent-explorer** - Discovers database schema
