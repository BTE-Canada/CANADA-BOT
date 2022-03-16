module.exports = {
    name: 'leaderboard',
    aliases: ['top', 'l'],
    cooldown: 1,
    needAdmin: false,
    async execute(msg, args, client) {
        msg.reply(
            'use the slash command `/leaderboard` to view the points leaderboard!'
        )
    },
}
