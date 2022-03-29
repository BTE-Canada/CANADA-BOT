module.exports = {
    name: 'steppe',
    aliases: ['step', 'poem'],
    cooldown: 10,
    needAdmin: false,
    execute(msg, args, client) {
        if (
            msg.author.id == '685605107378946057' ||
            msg.author.id == '360392861608574978'
        ) {
            msg.channel.send(`uwu steppe
steppe
steppe 
stop
stoppe
good bye steppes
i must travel the interwebs
[picture]
No more steppe jesus
:suh_huh:
:xeram:
steppe poem`)
        } else {
            msg.channel.send('You are not allowed to use this.')
        }
    },
} // cry about the formatting
