export default {
    names: ['queue'],
    execute: async (client, message, args) => {
        const serverQueue = queue.get('queue');

        if (!serverQueue || !serverQueue.songs) {
            return message.channel.send("There are no songs in the queue.");
        }

        let queuetxt = '';

        for (let i = 0; i < serverQueue.songs.length; i++) {
            const { duration, title, requestedby } = serverQueue.songs[i];

            const minutes = `${Math.floor(duration / 60)}`.padStart(2, '0');
            const seconds = `${duration % 60}`.padStart(2, '0');

            const loopMarker = serverQueue.loop && i === 0 ? '🔄 ' : '';

            queuetxt += `${i + 1}. ${loopMarker}\`${title}\` (**${minutes}:${seconds}**) [requested by **@${requestedby}**]\n`;
        }

        return message.channel.send(queuetxt);
    }
};
