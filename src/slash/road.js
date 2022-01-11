const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('road')
        .setDescription('*dies*')
        .addStringOption((option) =>
            option
                .setName('link')
                .setDescription('submission msg link')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('roadtype')
                .setDescription('WhAT TYPE')
                .setChoices([
                    ['Standard', 2],
                    ['Advanced', 5],
                ])
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('km')
                .setDescription('Number of KMs')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('complexity')
                .setDescription('Complexity!')
                .setChoices([
                    ['flat road', 1],
                    ['bit complex', 1.5],
                    ['COMPLEX', 2],
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
        ),
    async execute(i) {
        if (!i.member.roles.cache.has('812569861317459968'))
            return i.reply('you dont have permission for this command SMH!')

        await i.reply('doing stuff...')
        const client = i.client
        const options = i.options

        try {
            // get submission msg and other useful info
            const theChannel = await client.channels.fetch('880661113958711336')
            const link = options.getString('link')
            const msgId = link.substring(link.length - 18)
            const submissionMsg = await theChannel.messages.fetch(msgId)
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
            const roadType = options.getNumber('roadtype')
            const roadKms = options.getNumber('km')
            const complexity = options.getNumber('complexity')
            const incompletion = options.getNumber('incompletion') || 1
            const bonus = options.getNumber('bonus') || 1
            const collaborators = options.getInteger('collaborators') || 1

            const pointsTotal =
                (roadType * roadKms * complexity * incompletion * bonus) /
                collaborators

            // add submission info to db
            await client.con
                .promise()
                .query(
                    `insert into submissions (msg_id, submission_type, points_total, bonus, collaboration, user_id, submission_time, review_time, reviewer) values (?,'ROAD',?,?,?,?,?,?,?)`,
                    [
                        msgId,
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
                    `insert into road (msg_id, road_type, road_kms, complexity) values (?,?,?,?)`,
                    [msgId, roadType, roadKms, complexity]
                )

            i.followUp(
                `SUCCESS YAY!!!<:HAOYEEEEEEEEEEAH:908834717913186414>\n\n<@${userId}> has gained **${pointsTotal} points!!!**\n\n*__Points breakdown:__*\nRoad type: ${roadType}\nComplexity multiplier: ${complexity}\nDistance: ${roadKms}\nBonuses: ${bonus}\nCollaborators: ${collaborators}\nReview/submission time: ${reviewTime}/${submissionTime}`
            )
            submissionMsg.react('✅')
        } catch (err) {
            i.followUp(
                `ERROR HAPPENED IDOT!<:bonk:720758421514878998><:bonk:720758421514878998>\n${err}`
            )
        }
    },
}