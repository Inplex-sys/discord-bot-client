import type { Client } from 'discord.js';
import Command from './Command';

class SetRole extends Command {
    constructor(client: Client<boolean>) {
        super(client, {
            description: 'Set a role for a user',
            arguments: ['guild', 'user', 'role'],
        });
    }

    async execute(guildId: string, userId: string, roleId: string): Promise<void | Error> {
        const guild = this.client.guilds.cache.get(guildId);
        const member = await guild?.members.fetch(userId);
        if (!member) return new Error('Could not find the user');

        const role = guild?.roles.cache.find((role) => role.id === roleId);
        if (!role) return new Error('Could not find the role');

        await member.roles.add(role);
    }
}

export default SetRole;
