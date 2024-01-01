export default (client) => {

    client.user.setPresence({
        activities: [{
            name: '.gg/t4v5tby5P5',
            type: 'WATCHING'
        }],
        status: 'dnd'
    });

    console.log(`@${client.user.username} is ready!`);
};