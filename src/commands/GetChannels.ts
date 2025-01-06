import type { Client } from 'discord.js';

import Command from './Command';

class GetChannels extends Command {
    constructor(client: Client<boolean>) {
        super(client, {
            description: 'Get all channels in the guild',
            arguments: ['guild'],
        });
    }

    async execute(guildId: string): Promise<{ name: string; id: string }[] | Error> {
        const guild = this.client.guilds.cache.get(guildId);
        if (!guild) return new Error('Could not find the guild');

        const channels = guild.channels.cache.map((channel) => {
            return {
                name: channel.name,
                id: channel.id,
            };
        });

        return channels;
    }
}

export default GetChannels;
