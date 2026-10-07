import { v4 as uuid } from 'uuid';
import pino, { Logger } from 'pino';

export abstract class Agent<In = any, Out = any> {
  id: string;
  name: string;
  version: string;
  protected logger: Logger;

  constructor(name: string, version: string) {
    this.id = uuid();
    this.name = name;
    this.version = version;
    this.logger = pino(
      {
        name: name,
        level: process.env.LOG_LEVEL || 'info',
      },
      pino.destination(2)
    );
  }

  abstract execute(input: In): Promise<Out>;

  getName(): string {
    return this.name;
  }

  getVersion(): string {
    return this.version;
  }

  getId(): string {
    return this.id;
  }
}
