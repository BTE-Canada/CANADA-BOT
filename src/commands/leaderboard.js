const Discord = require('discord.js')
module.exports = {
    name: 'leaderboard',
    aliases: ['top', 'l'],
    cooldown: 1,
    needAdmin: false,
    async execute(msg, args, client) {
        const page = args[0] || 1
        let leaderboard = ''
        let range = [-10, -1]
        if (!isNaN(page) && parseInt(page) < 10 && parseInt(page) > 0) {
            range = [-page * 10, -page * 10 + 9]
        } else {
            return msg.reply(
                'Invalid page number! Use `=leaderboard [page number from 1-4; defaults to 1]`'
            )
        }
        console.log(range)
        const result = await client.redis.zrange(
            'leaderboard',
            range[0],
            range[1],
            'WITHSCORES'
        )
        console.log(result)
        result.reverse()

        for (let i = 0; i < result.length; i++) {
            if (i % 2 === 0) {
                leaderboard += `**${i / 2 + 1 + (page - 1) * 10}.** <@${
                    result[i + 1]
                }>: ${result[i]}\n\n`
            }
        }

        const embed = new Discord.MessageEmbed()
            .setTitle(`POINTS LEADERBOARD!`)
            .setDescription(leaderboard)

        msg.channel.send({ embeds: [embed] })
    },
}
