const { prefix, submitChannel } = require('../../config.json')
const Discord = require('discord.js')
const cooldowns = new Discord.Collection()
const checkFormat = require('../util/checkFormat')

function checkMessageForString(stringCheck, wordsCheck) {
    // string contains the words to check, separated by spaces
    const wordsArr = wordsCheck.split(' ')
    for (const word of wordsArr) if (!stringCheck.includes(word)) return false
    return true
}

module.exports = {
    name: 'messageCreate',
    async execute(msg, client, con2) {
        if (msg.author.bot) return

        // Message events //
        if (msg.channel.id === submitChannel) {
            await checkFormat(client, msg)
            return
        }

        if (
            msg.content == 'uwuusowarm' &&
            msg.author.id == '360392861608574978'
        ) {
            // Ignore this : )
            msg.reply(':smirk_cat:')
        }
        if (!msg.member.roles.cache.has('692801758761844746')) {
            if (checkMessageForString(msg.content.toLowerCase(), 'how join')) {
                msg.reply(
                    `Hi friend, I suspect that you may be looking for how to join our server!\n:pleading_face: please :pleading_face: look in <#752648404219461753> and <#776176449849393162> for detailed information. Welcome to BTE-Canada! :SPINNYCANADA:`
                )
            }
            if (
                /.*(is|has)(\s|\w)+(finished|built|done).*/.test(
                    msg.content.toLowerCase()
                )
            ) {
                msg.reply(
                    `Hi! Are you :thinking: wondering :thinking: if *[insert city]* is finished?\nIt certainly isn't! Guess what, we need ***your*** help to finish it.\nGo to <#752648404219461753> to see how to become a builder for our team and/or to <#776176449849393162> to see how to join our server and see our progress :happydog: !!!!`
                )
            }
        }

        if (!prefix.includes(msg.content.charAt(0))) {
            return
        }

        const args = msg.content.slice(1).trim().split(/ +/)
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
                    (
                        msg.member.roles.cache.has('812569861317459968') ||
                        msg.member.id == '306529453826113539'
                    ) // :eyes:
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

        if (timestamps.has(msg.guild.id)) {
            const expirationTime = timestamps.get(msg.guild.id) + cooldownAmount

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                return msg.reply(
                    `please wait ${timeLeft.toFixed(
                        1
                    )} more second(s) before reusing the \`${
                        command.name
                    }\` command.`
                )
            }
        }

        timestamps.set(msg.guild.id, now)
        setTimeout(() => timestamps.delete(msg.guild.id), cooldownAmount)

        try {
            command.execute(msg, args, client, con2)
        } catch (error) {
            msg.reply('ERROR HAPPENED IDOT!\n' + error)
        }
    },
}
