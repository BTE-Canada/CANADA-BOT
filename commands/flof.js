const animals = require('random-animals-api')

module.exports = {
    name: 'flof',
    cooldown: 1,
    needAdmin: false,
    execute(msg, args, client) {
        animals
            .fox()
            .then((url) => msg.reply(url))
            .catch((error) => console.error(error));
        
    }
}
