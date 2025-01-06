import type { Client } from 'discord.js';

class Command {
    protected client: Client;
    public name: string;
    public description: string;
    public arguments: string[];

    constructor(client: Client<boolean>, options: { description: string; arguments: string[] }) {
        this.client = client;
        this.name = this.constructor.name;

        this.description = options.description;
        this.arguments = options.arguments;
    }

    async formatName(): Promise<string> {
        return this.name
            .replace(/([A-Z])/g, '-$1')
            .toLowerCase()
            .slice(1);
    }
}

export default Command;
