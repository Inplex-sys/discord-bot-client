import type { Client } from 'discord.js';
import chalk from 'chalk';

import Command from './Command';
import { getCommands } from '../constants';

class Help extends Command {
    constructor(client: Client<boolean>) {
        super(client, {
            description: 'Get all commands and their descriptions',
            arguments: [],
        });
    }

    async execute() {
        const commands = await getCommands(this.client);

        const message = commands.map((command) => {
            let parameters = '';

            if (command.arguments.length != 0) {
                command.arguments.forEach((argument) => {
                    parameters += chalk.bold('<' + argument + '> ');
                });
            }

            return command.name + ' ' + parameters + ' - ' + command.description + '\n';
        });

        return 'Help Message \n\n' + message;
    }
}

export default Help;
