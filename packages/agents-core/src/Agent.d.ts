export declare abstract class Agent<In = any, Out = any> {
    id: string;
    name: string;
    version: string;
    constructor(name: string, version: string);
    abstract execute(input: In): Promise<Out>;
    getName(): string;
    getVersion(): string;
    getId(): string;
}
//# sourceMappingURL=Agent.d.ts.map