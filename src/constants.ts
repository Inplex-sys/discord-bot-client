import type { Client } from 'discord.js';
import CreateChannel from './commands/CreateChannel';
import CreateInvite from './commands/CreateInvite';
import DeleteChannels from './commands/DeleteChannels';
import GetChannels from './commands/GetChannels';
import GetGuilds from './commands/GetGuilds';
import GetMessages from './commands/GetMessages';
import Help from './commands/Help';
import SetRole from './commands/SetRole';

const classes: any[] = [
    CreateChannel,
    CreateInvite,
    DeleteChannels,
    GetChannels,
    GetGuilds,
    GetMessages,
    Help,
    SetRole,
];

let commands:
    | {
          name: string;
          arguments: string[];
          description: string;
          callback: (...args: any[]) => any;
      }[]
    | null;

const getCommands = async (
    client: Client,
): Promise<
    {
        name: string;
        arguments: string[];
        description: string;
        callback: (...args: any[]) => any;
    }[]
> => {
    if (commands) return commands;

    commands = await Promise.all(
        classes.map(async (context) => {
            const instance = new context(client);
            const name = await instance.formatName.bind(instance)();

            return {
                name: name,
                description: instance.description,
                arguments: instance.arguments,
                callback: instance.execute.bind(instance),
            };
        }),
    );

    return commands;
};

export { getCommands };
