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
        } else if (args[0] === 'FURRY') {
            msg.reply(`x3 nuzzles! :SHAKYEGGPLANT:  pounces on you uwu you so warm (Ooo) :heart_eyes_cat:
Couldn't help but notice your bulge from across the floor
Nuzzles yo' necky wecky-tilde murr-tilde :sogyyeetus:  hehe
Unzips yo baggy ass pants, oof baby you so musky :wink: 
Take me home, pet me, ’n' make me yours and don't forget to stuff me!
See me wag :hugging: my widdle baby tail all for your buldgy-wuldgy!
Kissies 'n' lickies yo neck :hugging: 
I hope :Flushed_monkey: daddy likies
:rainbow_flag: Nuzzles 'n' wuzzles yo chest (yuh)
I be (yeah) gettin' thirsty :GAYMUM: 

Hey, I got a little itch, :4490_lust:  you think you can help me?
Only seven inches long uwu, PLEASE ADOPT ME
Paws on your buldge :5836_shock:  as I lick my lips (UwU :flushed: punish me please)
’Boutta hit ’em with this furry shit (He don't see it comin’)`)
        } else {
            msg.reply(
                'nya! that is invalid command usage. correct command usage: `[prefix]nya [flof | melon | rawr]`'
            )
        }
    },
}
