const animals = require('random-animals-api')

module.exports = {
    name: 'melon',
    cooldown: 1,
    needAdmin: false,
    execute(msg, args, client) {
        animals
            .lizard()
            .then((url) => msg.reply(url))
            .catch((error) => console.error(error))
    },
}
