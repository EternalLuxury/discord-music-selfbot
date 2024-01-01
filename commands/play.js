import ytdl from 'ytdl-core';
import utils from '../utils.js';

export default {
    names: ['play'],
    execute: async (client, message, args) => {
        if (!args[0]) {
            return message.channel.send("Please provide a song.");
        }

        let FUrl;
        if (utils.isURL(args[0])) {
            FUrl = args[0];
        } else {
            FUrl = await utils.getUrl(args);
        }

        const voiceChannel = message.member.voice.channel;
        const serverQueue = queue.get('queue');
        
        try {
            const songInfo = await ytdl.getBasicInfo(FUrl);

            const song = {
                title: songInfo.videoDetails.title,
                duration: songInfo.videoDetails.lengthSeconds,
                url: FUrl,
                requestedby: message.author.username
            };

            if (!serverQueue || !serverQueue.songs) {
                const queueConstruct = {
                    textchannel: message.channel,
                    voiceChannel,
                    connection: null,
                    songs: [],
                    volume: 1,
                    playing: true,
                    loop: false,
                    skipped: false
                };

                queue.set('queue', queueConstruct);
                queueConstruct.songs.push(song);

                if (voiceChannel) {
                    message.channel.send(`Now playing: [${song.title}](${song.url})`);

                    const connection = utils.joinVChannel(voiceChannel);
                    queueConstruct.connection = connection;
                    utils.play(queueConstruct.songs[0]);
                } else {
                    queue.delete('queue');
                    message.channel.send("You need to be in a voice channel.");
                }
            } else {
                serverQueue.songs.push(song);
                message.channel.send(`Successfully added [${song.title}](${song.url}) to the queue.`);
            }
        } catch (error) {
            console.error(`Error getting song information: ${error}`);
            message.channel.send("An error occurred while trying to play the song.");
        }
    }
};
