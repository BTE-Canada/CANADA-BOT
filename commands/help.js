const { prefix } = require('../config.json')

module.exports = {
    name: 'help',
    needAdmin: false,
    execute(msg, args, client) {
        if (args[0] == 'me') {
            return msg.reply('you need help')
        }
        if (msg.member.roles.cache.has('812569861317459968')) {
            msg.reply(
                'you have staff role.\n\ngive points to a build submission: `=review [submission link] [S/M/L] [quality 1, 1.5, 2] <incompletion 0.5, 1> <collaborators>`\n\nedit the points for a build submission:`=edit [submission link] [S/M/L] [quality 1, 1.5, 2] <incompletion 0.5, 1> <collaborators>`\n\nsend feedback for a build submission via DM: `=feedback [submission msg link] [feedback feedback]`'
            )
        }
        msg.channel.send(
            `I use the following prefixes:\n` +
                prefix +
                '\n\nTo view your :sparkles: **points** :sparkles:, use the cmd `[prefix]points`\n\nto view someone elses points use `[prefix]see [user id]`'
        )
    },
}
