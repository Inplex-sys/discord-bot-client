import type { Client } from 'discord.js';

import Command from './Command';

class DeleteChannels extends Command {
    constructor(client: Client<boolean>) {
        super(client, {
            description: 'Delete all channels in the guild',
            arguments: ['channel'],
        });
    }

    async execute(channelId: string): Promise<void> {
        this.client.guilds.cache.get(channelId)?.channels.cache.map((channel) => {
            channel.delete();
        });
    }
}

export default DeleteChannels;
