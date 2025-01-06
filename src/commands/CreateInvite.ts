import type { Client } from 'discord.js';

import Command from './Command';

class CreateInvite extends Command {
    constructor(client: Client<boolean>) {
        super(client, {
            arguments: ['guild', 'channel'],
            description: 'Create an invite for a channel',
        });
    }

    async execute(guildId: string, channelId: string): Promise<{ link: string } | Error> {
        const guild = await this.client.guilds.fetch(guildId);

        const invite = await guild?.invites.create(channelId);
        if (!invite) return new Error('Could not create invite');

        return {
            link: 'https://discord.gg/' + invite.code,
        };
    }
}

export default CreateInvite;
