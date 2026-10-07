import { Agent } from '@agents/agents-core';
export interface DockerOperation {
    action: 'build' | 'run' | 'push' | 'pull' | 'stop' | 'deploy' | 'compose';
    imageName?: string;
    tags?: string[];
    containerName?: string;
    ports?: string[];
    volumes?: string[];
    env?: Record<string, string>;
    dockerfile?: string;
    dockerComposeFile?: string;
    registry?: string;
}
export interface JenkinsOperation {
    action: 'trigger' | 'status' | 'build' | 'pipeline' | 'deploy' | 'logs';
    jobName?: string;
    buildNumber?: number;
    parameters?: Record<string, string>;
    waitForCompletion?: boolean;
}
export interface GitOperation {
    action: 'clone' | 'commit' | 'push' | 'pull' | 'branch' | 'merge' | 'tag' | 'log';
    repo?: string;
    message?: string;
    branch?: string;
    remoteBranch?: string;
    tagName?: string;
    localPath?: string;
}
export interface PostmanOperation {
    action: 'run' | 'test' | 'export' | 'import' | 'lint';
    collectionFile?: string;
    environment?: string;
    resultsPath?: string;
}
export interface CICDPipeline {
    name: string;
    steps: {
        stage: string;
        tool: 'docker' | 'jenkins' | 'git' | 'postman' | 'kubectl' | 'terraform';
        commands: string[];
    }[];
}
export interface DevOpsOutput {
    success: boolean;
    operationType: string;
    results: {
        output?: string;
        status?: string;
        details?: Record<string, any>;
        timestamp: string;
        duration?: number;
    };
    artifacts?: {
        type: string;
        path: string;
        size?: string;
    }[];
    recommendations?: string[];
    errors?: string[];
}
/**
 * DevOps & Development Expert Agent
 * Handles: Docker, Jenkins, Git operations, Postman testing, CI/CD pipelines
 * Layer: 8 (Infrastructure & DevOps)
 */
declare class DevOpsAgent extends Agent {
    private dockerHost;
    private jenkinsUrl;
    private jenkinsUser;
    private jenkinsToken;
    private gitBinaryPath;
    private postmanApiKey;
    constructor();
    /**
     * Main execution method
     */
    execute(input: any): Promise<DevOpsOutput>;
    /**
     * Handle Docker operations
     */
    private handleDockerOperation;
    /**
     * Handle Jenkins operations
     */
    private handleJenkinsOperation;
    /**
     * Handle Git operations
     */
    private handleGitOperation;
    /**
     * Handle Postman operations
     */
    private handlePostmanOperation;
    /**
     * Handle full CI/CD pipeline
     */
    private handleCICDPipeline;
    private dockerBuild;
    private dockerRun;
    private dockerCompose;
    private dockerPush;
    private dockerDeploy;
    private jenkinsTriggerBuild;
    private jenkinsGetStatus;
    private jenkinsBuild;
    private jenkinsPipeline;
    private jenkinsGetLogs;
    private gitClone;
    private gitCommit;
    private gitPush;
    private gitPull;
    private gitBranch;
    private gitMerge;
    private gitLog;
    private postmanRun;
    private postmanTest;
    private postmanExport;
    private getDockerRecommendations;
    private getJenkinsRecommendations;
    private getGitRecommendations;
    private getPostmanRecommendations;
}
export default DevOpsAgent;
//# sourceMappingURL=dev-ops.d.ts.map