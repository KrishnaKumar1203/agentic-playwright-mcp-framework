import { v4 as uuid } from 'uuid';

export abstract class Agent<In = any, Out = any> {
  id: string;
  name: string;
  version: string;

  constructor(name: string, version: string) {
    this.id = uuid();
    this.name = name;
    this.version = version;
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
