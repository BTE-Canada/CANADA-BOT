const { prefix } = require('../../config.json')

module.exports = {
    name: 'help',
    needAdmin: false,
    execute(msg, args, client) {
        if (args[0] === 'me') {
            return msg.reply('you need help')
        }
        msg.channel.send(
            `I use the following prefixes:\n` +
                prefix +
                `\n\nTo view your :sparkles: **points** :sparkles: or someone else's points, use the **slash command** \`/points\`\n\nView top 10 leaderboard with \`[prefix]leaderboard\``
        )
    },
}
