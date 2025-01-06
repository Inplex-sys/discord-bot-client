import chalk from 'chalk';

class Exception {
    static Error(command: string, parameters: string[], error: Error) {
        if (commands.hasOwnProperty(command)) {
            return console.log(
                `Error: The command ${chalk.red(command)} takes ${chalk.red(commands[command].args.length)} arguments`,
            );
        } else {
            return console.log(`Error: The command ${chalk.red(command)} does not exist`);
        }
    }
}

export default Exception;
