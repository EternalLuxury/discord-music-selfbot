import YouTube from 'youtube-sr';
import ytdl from 'ytdl-core';
import { createAudioResource, createAudioPlayer, joinVoiceChannel } from '@discordjs/voice';

const play = async (song) => {
    const serverQueue = queue.get('queue');

    if (!song) {
        handleQueueEnd(serverQueue);
        return;
    }

    const resource = createAudioResource(await getStream(song.url), {
        inlineVolume: true,
    });

    const player = createAudioPlayer();
    subscribePlayer(serverQueue.connection, player);

    player.play(resource);

    player.addListener('stateChange', (oldState, newState) => {
        if (newState.status === 'idle') {
            handlePlaybackFinished(serverQueue);
            play(serverQueue.songs[0]);
        }
    });

    player.on('error', (error) => {
        handlePlayerError(error);
    });

    adjustVolume(serverQueue);
};

const getStream = async (url) => {
    return ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    });
};

const subscribePlayer = (connection, player) => {
    connection.subscribe(player);
};

const handleQueueEnd = (serverQueue) => {
    serverQueue.connection.destroy();
    queue.delete('queue');
};

const handlePlaybackFinished = (serverQueue) => {
    if (serverQueue.songs[0]) {
        console.log(`Finished playing the music: ${serverQueue.songs[0].title}`);
    } else {
        console.log(`Finished playing all musics, no more musics in the queue`);
    }

    if (!serverQueue.loop || serverQueue.skipped) {
        serverQueue.songs.shift();
    }

    if (serverQueue.skipped) {
        serverQueue.skipped = false;
    }
};

const adjustVolume = (serverQueue) => {
    const { volume } = serverQueue;
    const logarithmicVolume = volume / 5;
    serverQueue.connection._state.subscription.player._state.resource.volume.setVolumeLogarithmic(logarithmicVolume);
};

const isURL = (url) => {
    if (!url) return false;
    const urlPattern = /^(https?:\/\/)?([a-z\d]([a-z\d-]*[a-z\d])*\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3})|localhost(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
    return urlPattern.test(url);
};

const getUrl = async (words) => {
    const result = await YouTube.search(words.join(' '), { limit: 1 });
    return 'https://www.youtube.com/watch?v=' + result[0].id;
};

const joinVChannel = (voiceChannel) => {
    return joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
};

export default {
    play,
    isURL,
    getUrl,
    joinVChannel,
};
