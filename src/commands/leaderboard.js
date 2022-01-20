const Discord = require('discord.js')
module.exports = {
    name: 'leaderboard',
    aliases: ['top', 'l'],
    cooldown: 1,
    needAdmin: false,
    async execute(msg, args, client) {
        let leaderboard = ''

        const result = await client.redis.zrange(
            'leaderboard',
            -10,
            -1,
            'WITHSCORES'
        )
        result.reverse()

        for (let i = 0; i < result.length; i++) {
            if (i % 2 === 0) {
                leaderboard += `**${i / 2 + 1}.** <@${result[i + 1]}>: ${
                    result[i]
                }\n\n`
            }
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`POINTS LEADERBOARD!`)
            .setDescription(leaderboard)

        msg.channel.send({ embeds: [embed] })
    },
}
