const { SlashCommandBuilder } = require('@discordjs/builders')
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription(`view your points`)
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription(`view other people's points. (defaults to you)`)
                .setRequired(false)
        ),
    async execute(i) {
        const client = i.client
        const user = await i.options.getUser('user')

        // see your own points
        if (user === null) {
            const result = await client.con
                .promise()
                .query(
                    `select count(*), sum(points_total) from submissions where user_id = ?`,
                    [i.member.id]
                )

            let pointsTotal

            if (result[0][0]['sum(points_total)'] == null) {
                return i.reply(
                    `you have not gained any points yet :frowning: <:sad_cat:873457028981481473>`
                )
            } else {
                pointsTotal = parseFloat(result[0][0]['sum(points_total)'])
            }

            const rank = await client.redis.zrevrank('leaderboard', i.member.id)

            return i.reply(
                `you have completed :sparkles: **${
                    result[0][0]['count(*)']
                }** :sparkles: build(s) so far!\n\nyour total number of points is :tada: ***${pointsTotal}*** :tada: !!!\n\nYour leaderboard rank is **#${
                    rank + 1
                }**!`
            )
        } else {
            const result = await client.con
                .promise()
                .query(
                    `select count(*), sum(points_total) from submissions where user_id = ?`,
                    [user.id]
                )

            let pointsTotal
            if (result[0][0]['sum(points_total)'] == null) {
                pointsTotal = 0
            } else {
                pointsTotal = parseFloat(result[0][0]['sum(points_total)'])
            }
            const rank = await client.redis.zrevrank('leaderboard', user.id)

            const embed = new Discord.MessageEmbed()
                .setTitle(`POINTS!`)
                .setDescription(
                    `${user} has submitted :sparkles: **${
                        result[0][0]['count(*)']
                    }** :sparkles:  builds so far!\n\nTotal number of points: :tada: ***${pointsTotal}*** :tada: !!!\n\nLeaderboard rank: **#${
                        rank + 1
                    }**`
                )

            i.reply({
                embeds: [embed],
            })
        }
    },
}
