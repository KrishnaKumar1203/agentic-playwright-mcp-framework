import { Agent } from '@agents/agents-core';
export interface APIEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    description?: string;
    authentication?: 'none' | 'bearer' | 'apikey' | 'oauth2' | 'basic';
    rateLimit?: number;
    timeout?: number;
    retryPolicy?: {
        maxRetries: number;
        backoffMultiplier: number;
        delayMs: number;
    };
    requestSchema?: Record<string, any>;
    responseSchema?: Record<string, any>;
    examples?: {
        request?: any;
        response?: any;
    };
}
export interface APIRequest {
    endpoint: string;
    method: string;
    headers?: Record<string, string>;
    body?: any;
    query?: Record<string, string>;
    auth?: {
        type: string;
        credentials: any;
    };
    timeout?: number;
}
export interface APIResponse {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: any;
    duration: number;
    cached?: boolean;
}
export interface APIDocumentation {
    title: string;
    version: string;
    description?: string;
    baseUrl: string;
    endpoints: APIEndpoint[];
    models?: Record<string, any>;
    securitySchemes?: Record<string, any>;
}
export interface APIGatewayOutput {
    success: boolean;
    operationType: string;
    request?: APIRequest;
    response?: APIResponse;
    documentation?: APIDocumentation;
    metrics?: {
        responseTime: number;
        statusCode: number;
        cacheHit: boolean;
        rateLimitRemaining: number;
    };
    errors?: string[];
    recommendations?: string[];
}
/**
 * Modern API Gateway Agent
 * Handles: API management, orchestration, documentation, testing, monitoring, versioning
 * Layer: 9 (API Management)
 */
declare class APIGatewayAgent extends Agent {
    private baseUrl;
    private apiKey;
    private responseCache;
    private cacheExpiry;
    private rateLimits;
    constructor();
    /**
     * Main execution method
     */
    execute(input: any): Promise<APIGatewayOutput>;
    /**
     * Handle API request with intelligent retry, caching, and rate limiting
     */
    private handleAPIRequest;
    /**
     * Generate comprehensive API documentation
     */
    private generateDocumentation;
    /**
     * Test API endpoints comprehensively
     */
    private testAPI;
    /**
     * Validate API schema and responses
     */
    private validateAPI;
    /**
     * Create mock API for testing
     */
    private createMockAPI;
    /**
     * Monitor API health and performance
     */
    private monitorAPI;
    private makeRequestWithRetry;
    private buildHeaders;
    private isRetryableError;
    private getFromCache;
    private setCache;
    private checkRateLimit;
    private getRateLimitRemaining;
    private enrichEndpoints;
    private generateModels;
    private generateSecuritySchemes;
    private isValidSchema;
    private validateResponse;
    private getAPIRecommendations;
    private getErrorRecoveryStrategies;
    private getTestRecommendations;
    private getMonitoringRecommendations;
}
export default APIGatewayAgent;
//# sourceMappingURL=api-gateway.d.ts.map