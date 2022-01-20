module.exports = {
    name: 'points',
    aliases: ['p', 'me'],
    cooldown: 2,
    needAdmin: false,
    async execute(msg, args, client) {
        msg.reply(
            'use the slash command `/points` to view your points or other peoples points!'
        )
    },
}
