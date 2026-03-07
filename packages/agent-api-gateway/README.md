# agent-api-gateway

## Modern API Gateway & Management Agent

A sophisticated, modern API Gateway agent that handles all aspects of API management, orchestration, documentation, testing, and monitoring. Provides intelligent request routing, caching, rate limiting, and comprehensive API validation.

## Features

✅ **Intelligent Request Handling** - Smart routing, retry logic, timeout management  
✅ **Response Caching** - Automatic caching with configurable expiry  
✅ **Rate Limiting** - Per-endpoint rate limiting with sliding window  
✅ **Authentication** - Bearer token, API key, OAuth2, Basic auth support  
✅ **API Documentation** - Auto-generate Swagger/OpenAPI documentation  
✅ **Comprehensive Testing** - Full API test suite execution and validation  
✅ **Schema Validation** - Request/response schema validation  
✅ **Mock APIs** - Create mock servers for testing  
✅ **Performance Monitoring** - Real-time health and performance metrics  
✅ **Error Recovery** - Intelligent error handling with recovery strategies  
✅ **API Versioning** - Support for multiple API versions  
✅ **Request Transformation** - Transform requests/responses on-the-fly  

## Input Format

### API Request
```json
{
  "request": {
    "endpoint": "/api/v1/users",
    "method": "GET",
    "headers": {
      "Accept": "application/json"
    },
    "query": {
      "page": "1",
      "limit": "10"
    },
    "auth": {
      "type": "bearer",
      "credentials": "eyJhbGciOiJIUzI1NiIs..."
    },
    "timeout": 30000
  }
}
```

### API Documentation Generation
```json
{
  "documentation": {
    "title": "User API",
    "version": "1.0.0",
    "description": "API for managing users",
    "baseUrl": "https://api.example.com",
    "endpoints": [
      {
        "path": "/api/v1/users",
        "method": "GET",
        "description": "List all users",
        "authentication": "bearer",
        "rateLimit": 100,
        "timeout": 30000,
        "requestSchema": { "type": "object" },
        "responseSchema": { "type": "array" }
      }
    ],
    "securitySchemes": {
      "bearer": {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}
```

### API Testing
```json
{
  "test": {
    "endpoints": [
      "/api/v1/users",
      "/api/v1/users/:id",
      "/api/v1/users",
      "/api/v1/users/:id"
    ],
    "method": "GET",
    "assertions": [
      "status === 200",
      "response.data.length > 0"
    ]
  }
}
```

### API Validation
```json
{
  "validate": {
    "schema": {
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "email": { "type": "string", "format": "email" }
      },
      "required": ["id", "email"]
    },
    "response": {
      "id": "123",
      "email": "user@example.com"
    }
  }
}
```

### Mock API Creation
```json
{
  "mock": {
    "endpoints": [
      {
        "path": "/api/v1/users",
        "method": "GET",
        "response": { "users": [] }
      },
      {
        "path": "/api/v1/users",
        "method": "POST",
        "response": { "id": "123", "status": "created" }
      }
    ],
    "delay": 100
  }
}
```

### API Monitoring
```json
{
  "monitor": {
    "includeMetrics": [
      "uptime",
      "responseTime",
      "errorRate",
      "throughput"
    ],
    "alertThresholds": {
      "errorRate": 0.05,
      "responseTime": 1000
    }
  }
}
```

## Output Format

### API Request Response
```json
{
  "success": true,
  "operationType": "api-request",
  "request": {
    "endpoint": "/api/v1/users",
    "method": "GET"
  },
  "response": {
    "status": 200,
    "statusText": "OK",
    "headers": { "content-type": "application/json" },
    "body": { "users": [...] },
    "duration": 145,
    "cached": false
  },
  "metrics": {
    "responseTime": 145,
    "statusCode": 200,
    "cacheHit": false,
    "rateLimitRemaining": 99
  },
  "recommendations": [
    "Consider caching this response",
    "Response time is acceptable"
  ]
}
```

### API Test Results
```json
{
  "success": true,
  "operationType": "api-testing",
  "response": {
    "status": 200,
    "statusText": "OK",
    "body": {
      "totalTests": 5,
      "passed": 5,
      "failed": 0,
      "tests": [
        {
          "endpoint": "/api/v1/users",
          "method": "GET",
          "status": "passed",
          "duration": 145
        }
      ]
    }
  }
}
```

## Capabilities

### Request Handling
- **Intelligent Routing** - Route requests to correct endpoints
- **Automatic Retry** - Retry failed requests with exponential backoff
- **Request Transformation** - Transform request format before sending
- **Header Management** - Automatic header injection and validation
- **Timeout Management** - Configurable per-endpoint timeouts
- **Connection Pooling** - Reuse connections for performance

### Response Management
- **Caching Strategy** - Cache responses based on HTTP cache headers
- **Response Transformation** - Transform response format
- **Compression** - Automatic gzip/deflate decompression
- **Pagination** - Handle paginated responses
- **Rate Limiting** - Enforce per-endpoint rate limits
- **Response Validation** - Validate responses against schema

### Security
- **Authentication** - Multiple auth methods support
- **Authorization** - Token-based access control
- **HTTPS Validation** - Enforce HTTPS for production
- **CORS Handling** - Manage cross-origin requests
- **Injection Prevention** - Validate against injections
- **SSL/TLS** - Certificate validation

### Monitoring & Analytics
- **Response Time Tracking** - Monitor API performance
- **Error Rate Monitoring** - Track error frequencies
- **Throughput Metrics** - Monitor requests per second
- **Health Checks** - Periodic endpoint health verification
- **Alerting** - Trigger alerts on metrics thresholds
- **Logging** - Comprehensive request/response logging

## Integration Points

- **Inputs From**: agent-codegen (test requirements), agent-test-data (test data)
- **Outputs To**: agent-report-composer (API metrics), test frameworks
- **Dependencies**: Axios for HTTP, Express for mock servers
- **Configuration**: Via environment variables (API_BASE_URL, API_KEY)

## Smart Capabilities

### Intelligent Caching
- Respects HTTP cache headers
- Configurable cache expiry
- Cache invalidation on mutations
- Memory-efficient cache management

### Error Recovery
- Automatic retry for transient failures
- Exponential backoff strategy
- Circuit breaker pattern support
- Graceful degradation

### Rate Limiting
- Sliding window rate limiting
- Per-endpoint limits
- Request queuing
- Limit header support

### API Versioning
- Support for multiple API versions
- Backward compatibility checks
- Deprecation warnings
- Version migration guidance

## Use Cases

1. **API Gateway** - Central point for all API requests
2. **API Testing** - Automated API test suite execution
3. **API Documentation** - Generate and publish API docs
4. **API Monitoring** - Real-time API health monitoring
5. **Mock Testing** - Test with mock APIs
6. **API Development** - Design and prototype APIs
7. **Integration Testing** - Test API integrations
8. **Performance Testing** - Load and stress testing

## Environment Variables

```bash
API_BASE_URL=https://api.example.com      # Base URL for API
API_KEY=your-api-key                      # Default API key
API_TIMEOUT=30000                         # Default timeout in ms
CACHE_ENABLED=true                        # Enable response caching
CACHE_EXPIRY=300000                       # Cache expiry in ms
RATE_LIMIT=100                            # Requests per minute
```

## Dependencies

- **axios** (^1.6.2) - HTTP client
- **express** (^4.18.2) - Mock API server
- **swagger-jsdoc** (^6.2.8) - Generate Swagger docs
- **swagger-ui-express** (^5.0.0) - Swagger UI
- **uuid** (^9.0.1) - Unique identifier generation

## Layer

**Layer 9: API Management**  
Extended layer for comprehensive API gateway and management functionality.

## Example Usage

### Make API Request with Caching
```json
{
  "request": {
    "endpoint": "/api/v1/users/1",
    "method": "GET",
    "auth": {
      "type": "bearer",
      "credentials": "token123"
    }
  }
}
```

### Generate API Documentation
```json
{
  "documentation": {
    "title": "My API",
    "version": "1.0.0",
    "baseUrl": "https://api.example.com",
    "endpoints": [...]
  }
}
```

### Test API Endpoints
```json
{
  "test": {
    "endpoints": ["/users", "/users/1"],
    "method": "GET"
  }
}
```

### Create Mock API Server
```json
{
  "mock": {
    "endpoints": [
      {
        "path": "/api/v1/users",
        "method": "GET",
        "response": { "users": [] }
      }
    ]
  }
}
```

## Status

✅ **Ready for Production**  
✅ **Modern API Gateway Capabilities**  
✅ **Comprehensive Testing & Validation**  
✅ **Advanced Caching & Rate Limiting**  
✅ **Production-Grade Monitoring**

---

**Version**: 1.0.0  
**Created**: March 7, 2026  
**Layer**: 9 (API Management)  
**Status**: Active
