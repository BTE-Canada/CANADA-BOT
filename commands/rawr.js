const animals = require('random-animals-api')

module.exports = {
    name: 'rawr',
    cooldown: 1,
    noAdmin: true,
    execute(msg, args, client) {
        animals
            .cat()
            .then((url) => msg.reply(url))
            .catch((error) => console.error(error))
    },
}
