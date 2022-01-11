const animals = require('random-animals-api')

module.exports = {
    name: 'nya',
    cooldown: 1,
    needAdmin: false,
    execute(msg, args, client) {
        if (args[0] === 'flof') {
            animals
                .fox()
                .then((url) => msg.reply(url))
                .catch((error) => console.error(error))
        } else if (args[0] === 'melon') {
            animals
                .lizard()
                .then((url) => msg.reply(url))
                .catch((error) => console.error(error))
        } else if (args[0] === 'rawr') {
            animals
                .cat()
                .then((url) => msg.reply(url))
                .catch((error) => console.error(error))
        } else {
            msg.reply(
                'nya! that is invalid command usage. correct command usage: `[prefix]nya [flof | melon | rawr]`'
            )
        }
    },
}
