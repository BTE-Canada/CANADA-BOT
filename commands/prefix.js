const { prefix } = require('../config.json')

module.exports = {
    name: 'prefix',
    cooldown: 1,
    needAdmin: false,
    execute(msg, args, client) {
        msg.channel.send(`I use the following prefixes:\n\n`);
        prefix.forEach((i) => {
            msg.channel.send(i)
        })
    }
}