export default {
    names: ['clear'],
    execute: async (client, message, args) => {
        const serverQueue = queue.get('queue');

        if (serverQueue && serverQueue.songs) {
            serverQueue.songs = [serverQueue.songs[0]];
            message.channel.send("The queue has been cleared");
        } else {
            message.channel.send("There is no queue to clear");
        }
    }
};
