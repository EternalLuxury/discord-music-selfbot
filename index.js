import { Client } from 'discord.js-selfbot-v13';
import fs from 'fs/promises';
import Enmap from 'enmap';
import { Player } from 'discord-player';

import config from './config.js';

const client = new Client({
    checkUpdate: false,
});

global.queue = new Map();
client.commands = new Enmap();
client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    },
});

const importEvent = async (file) => {
    const event = (await import(`./events/${file}`)).default;
    client.on(file.split('.')[0], (...args) => event(client, ...args));
};

const importCommand = async (file) => {
    const command = (await import(`./commands/${file}`)).default;
    command.names.forEach((name) => client.commands.set(name, command));
};

const importFiles = async (directory, importFunction) => {
    const files = await fs.readdir(directory);
    const jsFiles = files.filter((file) => file.endsWith('.js'));

    for (const file of jsFiles) {
        await importFunction(file);
    }
};

(async () => {
    await importFiles('./events', importEvent);
    await importFiles('./commands', importCommand);

    try {
        await client.login(config.token);
    } catch (error) {
        console.error(`Error during login: ${error}`);
    }
})();
