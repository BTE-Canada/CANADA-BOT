const { SlashCommandBuilder } = require('@discordjs/builders')
const rankup = require('../util/rankup')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('land')
        .setDescription('*dies*')
        .addStringOption((option) =>
            option
                .setName('submissionid')
                .setDescription('submission msg ID')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('size')
                .setDescription('Land size in SQ Meters')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('complexity')
                .setDescription('Combexibee')
                .setChoices([
                    ['not complex lol', 1],
                    ['kinda complex', 1.5],
                    ['VERY COMPLEX', 2],
                ])
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('bonus')
                .setDescription('bonuses')
                .setChoices([
                    ['event', 2],
                    ['landmark', 2],
                    ['landmark & event', 4],
                ])
                .setRequired(false)
        )
        .addIntegerOption((option) =>
            option
                .setName('collaborators')
                .setDescription('collaborators')
                .setRequired(false)
        )
        .addBooleanOption((option) =>
            option.setName('edit').setDescription('edit?').setRequired(false)
        ),
    async execute(i) {
        if (!i.member.roles.cache.has('812569861317459968'))
            return i.reply('you dont have permission for this command SMH!')

        const client = i.client
        const options = i.options

        const submissionId = await options.getString('submissionid')
        if (isNaN(submissionId) || submissionId.length !== 18) {
            return i.reply(
                'That is not a valid message ID! (valid id example: 932761130990973008)'
            )
        }

        await i.reply('doing stuff...')

        try {
            // get submission msg and other useful info
            const theChannel = await client.channels.fetch('880661113958711336')
            let submissionMsg = null
            try {
                submissionMsg = await theChannel.messages.fetch(submissionId)
            } catch (e) {
                return i.followUp(
                    'That is not a valid message ID! (valid id example: 932761130990973008)'
                )
            }

            const userId = submissionMsg.author.id
            const submissionTime = submissionMsg.createdTimestamp
            const reviewTime = i.createdTimestamp
            const reviewer = i.user.id

            // calculate points
            const sqm = options.getNumber('size')
            const complexity = options.getNumber('complexity')
            const bonus = options.getNumber('bonus') || 1
            const collaborators = options.getInteger('collaborators') || 1

            const pointsTotal =
                (10 * sqm * complexity * bonus) / 50000 / collaborators

            // edit ---------------------
            if (options.getBoolean('edit') === true) {
                if (!submissionMsg.reactions.cache.has('✅')) {
                    return i.followUp(
                        'that one has not been graded yet <:bonk:720758421514878998>!'
                    )
                }

                const original = await client.con
                    .promise()
                    .query(
                        `select points_total from submissions where msg_id = '${submissionId}'`
                    )

                const pointChange =
                    pointsTotal - parseFloat(original[0][0].points_total)

                await client.con
                    .promise()
                    .query(
                        `update submissions set points_total = ?, bonus = ?, collaboration = ? where msg_id = ${submissionId}`,
                        [pointsTotal, bonus, collaborators]
                    )
                await client.con
                    .promise()
                    .query(
                        `update land set sqm = ?, complexity = ?, edit = true where msg_id = ${submissionId}`,
                        [sqm, complexity]
                    )

                await client.redis.zincrby('leaderboard', pointChange, userId)

                i.followUp(
                    `EDITED YAY!!!<:HAOYEEEEEEEEEEAH:908834717913186414>\n\n<@${userId}> has gained **${pointsTotal} points!!!**\n\n*__Points breakdown:__*\nLand area (Sq meters): ${sqm}\nComplexity multiplier: ${complexity}\nBonuses: ${bonus}\nCollaborators: ${collaborators}`
                )
            } else {
                // normal points -----------------
                if (submissionMsg.reactions.cache.has('✅')) {
                    return i.followUp(
                        'that one already got graded <:bonk:720758421514878998>!'
                    )
                }

                await client.con
                    .promise()
                    .query(
                        `insert into submissions (msg_id, submission_type, points_total, bonus, collaboration, user_id, submission_time, review_time, reviewer) values (?, 'LAND', ?,?,?,?,?,?,?)`,
                        [
                            submissionId,
                            pointsTotal,
                            bonus,
                            collaborators,
                            userId,
                            submissionTime,
                            reviewTime,
                            reviewer,
                        ]
                    )
                await client.con
                    .promise()
                    .query(
                        `insert into land (msg_id, sqm, complexity) values (?, ?, ?)`,
                        [submissionId, sqm, complexity]
                    )
                await rankup(client, submissionMsg.author, pointsTotal, i)

                await client.redis.zincrby('leaderboard', pointsTotal, userId)

                i.followUp(
                    `SUCCESS YAY!!!<:HAOYEEEEEEEEEEAH:908834717913186414>\n\n<@${userId}> has gained **${pointsTotal} points!!!**\n\n*__Points breakdown:__*\nLand area (Sq meters): ${sqm}\nComplexity multiplier: ${complexity}\nBonuses: ${bonus}\nCollaborators: ${collaborators}\nReview/submission time: ${reviewTime}/${submissionTime}\n${submissionMsg.url}`
                )
                submissionMsg.react('✅')
            }
        } catch (err) {
            i.followUp(
                `ERROR HAPPENED IDOT!<:bonk:720758421514878998><:bonk:720758421514878998>\n${err}`
            )
        }
    },
}
