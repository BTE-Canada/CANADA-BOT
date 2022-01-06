const Discord = require('discord.js')

module.exports = {
    name: 'deny',
    aliases: ['decline', 'reject', 'ew'],
    cooldown: 1,
    needAdmin: true,
    async execute(msg, args, client, con2) {
        if (args.length < 2) {
            return msg.reply(
                'incorrect command usage! do `=decline [submission msg link] [reason for decline aka feedback]`'
            )
        }
        try {
            const submitChannel = await client.channels.fetch(
                '880661113958711336'
            )
            const submission = await submitChannel.messages.fetch(
                args[0].substring(args[0].length - 18)
            )
            const builder = await client.users.fetch(submission.author.id)
            const dm = await builder.createDM()

            args.splice(0, 1)
            const feedback = args.join(' ')

            const embed = new Discord.MessageEmbed()
                .setTitle(`Your recent build submission has been declined.`)
                .setDescription(
                    `__[Submission link](${submission.url})__\nIf you want, use this feedback to improve your build then resubmit it to gain points:\n\n\`${feedback}\``
                )

            dm.send({ embeds: [embed] }).catch((err) => {
                return msg.reply(
                    `${builder} has dms turned off or something went wrong while sending the dm! ${err}`
                )
            })
            submission.react('❌')
            msg.reply('rejected and feedback sent :weena!: `' + feedback + '`')
        } catch (err) {
            msg.reply('ERR HAPPEND! ' + err)
        }
    },
}
