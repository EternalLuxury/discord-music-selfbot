export default {
    names: ['loop'],
    execute: async (client, message, args) => {
        const serverQueue = queue.get('queue');

        if (!serverQueue) {
            return message.channel.send("There is no song to loop.");
        }

        serverQueue.loop = !serverQueue.loop;

        const loopStatus = serverQueue.loop ? 'Started' : 'Stopped';
        message.channel.send(`${loopStatus} looping: ${serverQueue.songs[0].title}`);
    }
};
