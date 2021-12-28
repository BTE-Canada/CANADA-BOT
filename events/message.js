const { prefix, console } = require('../config.json')
const fs = require('fs')
const Discord = require('discord.js')
const cooldowns = new Discord.Collection()

module.exports = {
    name: 'message',
    async execute(message, client, con2) {
        if (message.author.bot) return
        if (message.content == "uwuusowarm" && message.author.id =="360392861608574978") { 
            message.reply(":smirk_cat:") 
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
            if (!message.member.roles.cache.has("812569861317459968")) return
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
            message.reply('ERROR HAPPENED IDOT!' + error)
        }
    },
}
