const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('many')
        .setDescription('*dies*')
        .addStringOption((option) =>
            option
                .setName('link')
                .setDescription('submission msg link')
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
        if (!i.member.roles.cache.has('812569861317459968'))
            return i.reply('you dont have permission for this command SMH!')

        await i.reply('doing stuff...')
        const client = i.client
        const options = i.options

        try {
            //get submission msg and other useful info
            const theChannel = await client.channels.fetch('880661113958711336')
            const link = options.getString('link')
            const msgId = link.substring(link.length - 18)
            const submissionMsg = await theChannel.messages.fetch(msgId)

            //check for already graded
            if (submissionMsg.reactions.cache.has('✅')) {
                return i.followUp(
                    'that one already got graded <:bonk:720758421514878998>!'
                )
            }

            const userId = submissionMsg.author.id
            const submission_time = submissionMsg.createdTimestamp
            const review_time = i.createdTimestamp
            const reviewer = i.user.id

            //calculate points
            const small_amt = options.getInteger('small_amt')
            const medium_amt = options.getInteger('medium_amt')
            const large_amt = options.getInteger('large_amt')
            const avg_quality = options.getNumber('avg_quality')
            const avg_incompletion = options.getNumber('avg_incompletion') || 1
            const bonus = options.getInteger('event_bonus') || 1
            const total_count = small_amt + medium_amt + large_amt

            const pointsTotal =
                (small_amt * 2 + medium_amt * 5 + large_amt * 10) *
                avg_quality *
                avg_incompletion *
                bonus

            //add submission info to db
            const myQuery = `insert into submissions (msg_id, submission_type, points_total, bonus, user_id, submission_time, review_time, reviewer) values (${msgId}, 'MANY', ${pointsTotal}, ${bonus}, ${userId}, ${submission_time}, ${review_time}, ${reviewer}); insert into many (msg_id, small_amt, medium_amt, large_amt, avg_quality, avg_incompletion, total_count) values (${msgId}, ${small_amt}, ${medium_amt}, ${large_amt}, ${avg_quality}, ${avg_incompletion}, ${total_count})`

            client.con.query(myQuery, (err) => {
                if (err) throw err
                i.followUp(
                    `SUCCESS YAY!!!<:HAOYEEEEEEEEEEAH:908834717913186414>\n\n<@${userId}> has gained **${pointsTotal} points!!!**\n\n*__Points breakdown:__*\nNumber of buildings (S/M/L): ${small_amt}/${medium_amt}/${large_amt}\nQuality multiplier: ${avg_quality}\nINCOMPLETION multiplier: ${avg_incompletion}\nBonuses: ${bonus}\nReview/submission time: ${review_time}/${submission_time}`
                )
                submissionMsg.react('✅')
            })
        } catch (err) {
            i.followUp(
                `ERROR HAPPENED IDOT!<:bonk:720758421514878998><:bonk:720758421514878998>\n${err}`
            )
        }
    },
}
