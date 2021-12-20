const { prefix } = require('../config.json')

module.exports = {
    name: 'help',
    needAdmin: false,
    execute(msg, args, client) {
        if (args[0] == 'me') {
            message.reply('you need help')
        }
        msg.channel.send(
            `I use the following prefixes:\n` +
                prefix +
                '\n\nTo view your :sparkles: **points** :sparkles:, use the cmd `=me`'
        )
    },
}
