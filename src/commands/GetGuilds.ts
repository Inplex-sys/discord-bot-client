import type { Client } from 'discord.js';

import Command from './Command';

class GetGuilds extends Command {
    constructor(client: Client<boolean>) {
        super(client, {
            description: 'Get all guilds the bot is in',
            arguments: [],
        });
    }

    async execute(): Promise<{ name: string; id: string }[] | Error> {
        const guilds = this.client.guilds.cache.map((guild) => {
            return {
                name: guild.name,
                id: guild.id,
            };
        });

        return guilds;
    }
}

export default GetGuilds;
