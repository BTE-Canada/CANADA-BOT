const { SlashCommandBuilder } = require('@discordjs/builders')
const rankup = require('../util/rankup')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('many')
        .setDescription('*dies*')
        .addStringOption((option) =>
            option
                .setName('submissionid')
                .setDescription('submission msg ID')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('small_amt')
                .setDescription('number of small buildings')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('medium_amt')
                .setDescription('number of medium buildings')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('large_amt')
                .setDescription('number of large buildings')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('avg_quality')
                .setDescription('average building quality from 1-2')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('avg_incompletion')
                .setDescription('average incompletion from 0.5-1')
                .setRequired(false)
        )
        .addIntegerOption((option) =>
            option
                .setName('event_bonus')
                .setDescription('all buildings are from event')
                .setChoices([['event', 2]])
                .setRequired(false)
        ),
    async execute(i) {
        if (!i.member.roles.cache.has('812569861317459968')) {
            return i.reply('you dont have permission for this command SMH!')
        }

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

            // check for already graded
            if (submissionMsg.reactions.cache.has('✅')) {
                return i.followUp(
                    'that one already got graded <:bonk:720758421514878998>!'
                )
            }
            const userId = submissionMsg.author.id
            const submissionTime = submissionMsg.createdTimestamp
            const reviewTime = i.createdTimestamp
            const reviewer = i.user.id

            // calculate points
            const smallAmt = options.getInteger('small_amt')
            const mediumAmt = options.getInteger('medium_amt')
            const largeAmt = options.getInteger('large_amt')
            const avgQuality = options.getNumber('avg_quality')
            const avgIncompletion = options.getNumber('avg_incompletion') || 1
            const bonus = options.getInteger('event_bonus') || 1
            const totalCount = smallAmt + mediumAmt + largeAmt

            const pointsTotal =
                (smallAmt * 2 + mediumAmt * 5 + largeAmt * 10) *
                avgQuality *
                avgIncompletion *
                bonus

            // add submission info to db
            await client.con
                .promise()
                .query(
                    `insert into submissions (msg_id, submission_type, points_total, bonus, user_id, submission_time, review_time, reviewer) values (?, 'MANY', ?,?,?,?,?,?)`,
                    [
                        submissionId,
                        pointsTotal,
                        bonus,
                        userId,
                        submissionTime,
                        reviewTime,
                        reviewer,
                    ]
                )

            await client.con
                .promise()
                .query(
                    `insert into many (msg_id, small_amt, medium_amt, large_amt, avg_quality, avg_incompletion, total_count) values (?,?,?,?,?,?,?)`,
                    [
                        submissionId,
                        smallAmt,
                        mediumAmt,
                        largeAmt,
                        avgQuality,
                        avgIncompletion,
                        totalCount,
                    ]
                )
            await rankup(client, submissionMsg.author, pointsTotal, i)

            await client.redis.zincrby('leaderboard', pointsTotal, userId)

            i.followUp(
                `SUCCESS YAY!!!<:HAOYEEEEEEEEEEAH:908834717913186414>\n\n<@${userId}> has gained **${pointsTotal} points!!!**\n\n*__Points breakdown:__*\nNumber of buildings (S/M/L): ${smallAmt}/${mediumAmt}/${largeAmt}\nQuality multiplier: ${avgQuality}\nINCOMPLETION multiplier: ${avgIncompletion}\nBonuses: ${bonus}\nReview/submission time: ${reviewTime}/${submissionTime}\n${submissionMsg.url}`
            )
            submissionMsg.react('✅')
        } catch (err) {
            i.followUp(
                `ERROR HAPPENED IDOT!<:bonk:720758421514878998><:bonk:720758421514878998>\n${err}`
            )
        }
    },
}
