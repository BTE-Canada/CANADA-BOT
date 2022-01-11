const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('one')
        .setDescription('*dies*')
        .addStringOption((option) =>
            option
                .setName('link')
                .setDescription('submission msg link')
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('size')
                .setDescription('building size')
                .setChoices([
                    ['small', 2],
                    ['medium', 5],
                    ['large', 10],
                    ['monumental', 20],
                ])
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName('quality')
                .setDescription('quality')
                .setChoices([
                    ['bleh', 1],
                    ['decent', 1.5],
                    ['very nice', 2],
                ])
                .setRequired(true)
        )
        .addNumberOption(
            (option) =>
                option
                    .setName('incompletion')
                    .setDescription('incomplete x0.5')
                    .setChoices([['incomplete', 0.5]])
                    .setRequired(false) // ---------------- SET DEFAULT VALUES TO 1 FOR INCOMPLETION AND BONUSES AND COLLABORATORS
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
                .setDescription('collaboratorsdsdfsdfs')
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
            const basePoints = options.getNumber('size')
            const quality = options.getNumber('quality')
            const incompletion = options.getNumber('incompletion') || 1
            const bonus = options.getNumber('bonus') || 1
            const collaborators = options.getInteger('collaborators') || 1

            const pointsTotal =
                (basePoints * quality * incompletion * bonus) / collaborators

            // add submission info to db
            await client.con
                .promise()
                .query(
                    `insert into submissions (msg_id, submission_type, points_total, bonus, collaboration, user_id, submission_time, review_time, reviewer) values (?, 'ONE', ?,?,?,?,?,?,?)`,
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
                    `insert into one (msg_id, building_size, quality, incompletion) values (?,?,?,?)`,
                    [msgId, basePoints, quality, incompletion]
                )
            i.followUp(
                `SUCCESS YAY!!!<:HAOYEEEEEEEEEEAH:908834717913186414>\n\n<@${userId}> has gained **${pointsTotal} points!!!**\n\n*__Points breakdown:__*\nBuilding type: ${basePoints}\nQuality multiplier: ${quality}\nINCOMPLETION multiplier: ${incompletion}\nBonuses: ${bonus}\nCollaborators: ${collaborators}\nReview/submission time: ${reviewTime}/${submissionTime}`
            )
            submissionMsg.react('✅')
        } catch (err) {
            i.followUp(
                `ERROR HAPPENED IDOT!<:bonk:720758421514878998><:bonk:720758421514878998>\n${err}`
            )
        }
    },
}
