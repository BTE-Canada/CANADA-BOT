const { prefix } = require('../config.json')
const fs = require('fs')
const Discord = require('discord.js')
const cooldowns = new Discord.Collection()

module.exports = {
    name: 'message',
    execute(message, client) {
        if (message.author.bot) return

        if (message.content.includes('submitted a build')) {
            const sentence = message.content.split(': ')
            const words = sentence[1].split(' ')
            const user = words[0]
            message.reply(words[0] + ' submitted a build!')
        }
        //=============================================================================

        if (message.channel.id != '845120160556777522') { return }

        if (!prefix.includes(message.content.charAt(0))) { return; };

        const args = message.content.slice(1).trim().split(/ +/)
        const commandName = args.shift().toLowerCase()
        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
            );

        console.log(commandName)
        if (!command) return


        if (command.noAdmin === false) {
            //check whitelist
            if (!whitelist.includes(message.author.id)) {
                //If person is not authorized, send msg
                const emoji = client.emojis.cache.get('801510839386374214')
                message.reply(
                    `HA ur not permitted to use this, FAILURE ${emoji}`
                )
                return
            }
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection())
        }

        const now = Date.now()
        const timestamps = cooldowns.get(command.name)
        const cooldownAmount = command.cooldown * 1000

        if (timestamps.has(message.guild.id)) {
            const expirationTime = timestamps.get(message.guild.id) + cooldownAmount

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000
                return message.reply(
                    `please wait ${timeLeft.toFixed(
                        1
                    )} more second(s) before reusing the \`${command.name
                    }\` command.`
                )
            }
        }

        timestamps.set(message.guild.id, now)
        setTimeout(() => timestamps.delete(message.guild.id), cooldownAmount)

        try {
            command.execute(message, args, client,)
        } catch (error) {
            console.error(error)
            message.reply('ERROR HAPPENED IDOT!')
        }

    }
}