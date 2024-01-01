export default {
    names: ['volume'],
    execute: async (client, message, args) => {
        const serverQueue = queue.get('queue');

        if (!serverQueue) {
            return message.channel.send("There is nothing playing right now.");
        }

        if (args.length === 0 || isNaN(args[0])) {
            return message.channel.send("Please provide a valid volume as a number.");
        }

        const requestedVolume = parseFloat(args[0]);

        if (requestedVolume < 0 || requestedVolume > 10) {
            return message.channel.send("Please provide a volume between 0 and 10.");
        }

        serverQueue.volume = requestedVolume;

        try {
            const volumePercent = (requestedVolume / 10) * 100;
            serverQueue.connection._state.subscription.player._state.resource.volume.setVolumeLogarithmic(volumePercent);
            message.channel.send(`Volume has been set to: ${requestedVolume}`);
        } catch (error) {
            console.error(`Error setting volume: ${error}`);
            message.channel.send("An error occurred while trying to set the volume.");
        }
    }
};
