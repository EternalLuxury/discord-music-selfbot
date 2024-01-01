import config from '../config.js';

export default async (client, message) => {
    if (!message.content.startsWith(config.prefix) || message.author.id === client.user.id) return;

    if (config.allowed.length != 0 && !config.allowed.includes(message.author.id)) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const commandData = client.commands.get(command);
    if (!commandData) return;

    try {
        await commandData.execute(client, message, args);
    } catch (error) {
        console.error(`Error executing command '${command}': ${error}`);
    }
};
