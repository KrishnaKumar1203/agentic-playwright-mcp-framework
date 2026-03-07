export interface AgentOutput<T = any> {
  id: string;
  taskId: string;
  result: T;
  status: 'success' | 'failure' | 'skipped';
  error?: Error;
  metadata?: Record<string, any>;
  timestamp: Date;
}
