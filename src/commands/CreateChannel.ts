import { ChannelType, type Client } from 'discord.js';

import Random from '../utils/random';
import Command from './Command';

class CreateChannel extends Command {
    constructor(client: Client<boolean>) {
        super(client, {
            description: 'Create a channel in the guild',
            arguments: ['guild', 'type'],
        });
    }

    async execute(guildId: string, type: 'text' | 'voice'): Promise<void> {
        const channelType = type === 'text' ? ChannelType.GuildText : ChannelType.GuildVoice;

        this.client.guilds.cache.get(guildId)?.channels.create({
            name: Random.string(5),
            type: channelType,
            topic: 'This raid channel was created by someone.',
        });
    }
}

export default CreateChannel;
