const { prefix } = require('../config.json')
const fs = require('fs')
const Discord = require('discord.js')
const cooldowns = new Discord.Collection()

function check_if_in_message(string_check, words_check) {
    // string contains the words to check, separated by spaces
    const array_words = words_check.split(' ')
    for (const word of array_words)
        if (!string_check.includes(word)) return false
    return true
}

module.exports = {
    name: 'messageCreate',
    async execute(message, client, con2) {
        if (message.author.bot) return

        // Message events //
        if (
            message.content == 'uwuusowarm' &&
            message.author.id == '360392861608574978'
        ) {
            // Ignore this : )
            message.reply(':smirk_cat:')
        }
        if (!message.member.roles.cache.has('692801758761844746')) {
            if (
                check_if_in_message(message.content.toLowerCase(), 'how join')
            ) {
                message.reply(`Hewo fwend :3, I ***suspect*** :jesus: that you may be looking for how to join our server :ahegao:,
:pleading_face: pwease :pleading_face: look in <#752648404219461753> and <#776176449849393162> to find how to do it, welcome to BTE-Canada, rawr! :SPINNYCANADA:`)
            }
            if (
                /.*(is|has)(\s|\w)+(finished|built|done).*/.test(
                    message.content.toLowerCase()
                )
            ) {
                message.reply(`:heart_eyes_cat: Ooooohhhhhhhh are you :thinking: wondering :thinking: if *[insert city]* is finished :pleading_face:?\n
It certainly isn't! :heart_eyes_cat: Guess what, we need ***your*** help to finish it :smirk_cat:. 
W-w-w-wait, senpai are you thinking that you are not a good enough builder to help us????? :pensive: :crying_cat_face: ...  
Let me tell you that ***you are wrong!*** We need people of all skill levels, we all sucked when we started, and I promise you that you'll get
the hang of this with practice, so, what are you waiting for? Go <#752648404219461753>!!!! :weary: *NYA!* :smile_cat:`)
            }
        }

        if (!prefix.includes(message.content.charAt(0))) {
            return
        }

        const args = message.content.slice(1).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()
        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            )

        if (!command) return

        if (command.needAdmin === true) {
            if (
                !(
                    message.member.roles.cache.has('812569861317459968') ||
                    message.member.id == '306529453826113539' // :eyes: 
                )
            )
                return
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection())
        }

        const now = Date.now()
        const timestamps = cooldowns.get(command.name)
        const cooldownAmount = command.cooldown * 1000

        if (timestamps.has(message.guild.id)) {
            const expirationTime =
                timestamps.get(message.guild.id) + cooldownAmount

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                return message.reply(
                    `please wait ${timeLeft.toFixed(
                        1
                    )} more second(s) before reusing the \`${
                        command.name
                    }\` command.`
                )
            }
        }

        timestamps.set(message.guild.id, now)
        setTimeout(() => timestamps.delete(message.guild.id), cooldownAmount)

        try {
            command.execute(message, args, client, con2)
        } catch (error) {
            message.reply('ERROR HAPPENED IDOT!\n' + error)
        }
    },
}
