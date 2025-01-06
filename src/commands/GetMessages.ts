import { ChannelType, type Client } from 'discord.js';

import Command from './Command';

class GetMessages extends Command {
    constructor(client: Client<boolean>) {
        super(client, {
            description: 'Get all messages in a channel',
            arguments: ['channel'],
        });
    }

    async execute(guildId: string, channelId: string): Promise<{ content: string; date: string }[] | Error> {
        const guild = await this.client.guilds.fetch(guildId);
        const channel = await guild.channels.fetch(channelId);

        if (!channel) return new Error('Could not find the channel');
        if (channel.type !== ChannelType.GuildText) return new Error('Channel is not a text channel');

        const messages = (
            await channel.messages.fetch({
                limit: 100,
            })
        ).map((message) => {
            const attachments = message.attachments.map((attachment: { url: string }) => attachment.url);

            return {
                content: message.content + attachments.join('\n'),
                date: new Date(message.createdTimestamp).toISOString(),
            };
        });

        return messages;
    }
}

export default GetMessages;
