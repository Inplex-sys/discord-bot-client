import type { Client } from 'discord.js';

import Command from './Command';

class GetMessages extends Command {
    constructor(client: Client<boolean>) {
        super(client, {
            description: 'Get all messages in a channel',
            arguments: ['channel'],
        });
    }

    async execute(channelId: string): Promise<{ embeds: any; attachments: string[]; content: string }[] | Error> {
        const channel = await this.client.channels.fetch(channelId);
        if (!channel) return new Error('Could not find the channel');

        const messages = channel.messages.map((message) => {
            const attachments = message.attachments.map((attachment: { url: string }) => attachment.url);

            return {
                embeds: message.embeds,
                attachments: attachments,
                content: message.content,
            };
        });

        return messages;
    }
}

export default GetMessages;
