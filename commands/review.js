module.exports = {
    name: 'review',
    aliases: ['r', 're', 'uwu'],
    cooldown: 1,
    needAdmin: true,
    async execute(msg, args, client, con2) {
        if (args.length < 3 || args.length > 8) {
            return msg.channel.send(
                'command usage failure!! <:bonk:720758421514878998>\n\nCorrect usage:\n`/review SINGLE [link] [size S, M, L] [quality 1, 1.5, 2] <incompletion> <bonuses E, L> <collaborators>`\n\n`/review MANY [link] [size] [avg quality 1-2] [# of builds] <avg incompletion 0.5-1> <bonuses E, L> <collaborators>`\n\n`/review LAND [link] [sq meters] [complexity 1, 1.5, 2] <bonuses E, L> <collaborators>`\n\n`/review ROAD [link] [road type S, A (Standard/Advanced)] [# of km] [complexity 1, 1.5, 2] <bonuses E, L> <collaboration>`'
            )
        }
        try {
            const types = 'SINGLE MANY LAND ROAD'
            if (!types.includes(args[0].toUpperCase())) {
                return msg.reply('thats not a valid submission type!')
            }
            const theChannel = await client.channels.fetch('880661113958711336')
            const msgId = args[1].substring(args[1].length - 18)
            const submissionMsg = await theChannel.messages.fetch(msgId)

            if (submissionMsg.reactions.cache.has('✅')) {
                return msg.reply(
                    'that one already got graded <:bonk:720758421514878998>!'
                )
            } else if (
                submissionMsg.author.id == msg.author.id &&
                msg.author.id !== '306529453826113539'
            ) {
                return msg.reply('dont grade urself stupid')
            }
            const bonus = args[args.length - 2]
            const collaborators = args[args.length - 1]
            msg.reply(bonus + collaborators)
        } catch (err) {
            return msg.channel.send(
                `ERROR HAPPENED IDOT!<:bonk:720758421514878998><:bonk:720758421514878998>\n${err}`
            )
        }

        const type = args[0].toUpperCase()
        const userId = submissionMsg.author.id
        if (type == 'SINGLE') {
            const buildingType = args[2].toUpperCase(),
                quality = args[3]
            let basePoints
            if (buildingType == 'S') {
                basePoints = 2
            } else if (buildingType == 'M') {
                basePoints = 5
            } else if (buildingType == 'L') {
                basePoints = 10
            }
        } else if (type == 'MANY') {
        } else if (type == 'LAND') {
        } else if (type == 'ROAD') {
        } else {
        }

        //-----------------------------------------
        if (1 == 5) {
            //check for command syntax corerct

            if (
                isNaN(args[2]) ||
                (args[3] && isNaN(args[3])) ||
                (args[4] && isNaN(args[4]))
            ) {
                return msg.channel.send(
                    'the multipliers need to be numbers! <:bonk:720758421514878998>\n\nCommand usage:\n`=review [submission link] [S/M/L] [quality 1, 1.5, 2] [incompletion 0.5, 1] [collaborators]`'
                )
            }
            if (args[2] > 2) {
                return msg.reply(
                    'quality multiplier cant be that value <:bonk:720758421514878998>'
                )
            }
            if (args[3] > 1) {
                return msg.reply(
                    'incompletion multiplier cant be that value <:bonk:720758421514878998>'
                )
            }
            try {
                const theChannel = await client.channels.fetch(
                    '880661113958711336'
                )
                const msgId = args[0].substring(args[0].length - 18)
                const submissionMsg = await theChannel.messages.fetch(msgId)

                //check for duplicate
                if (submissionMsg.reactions.cache.has('✅')) {
                    return msg.reply(
                        'that one already got graded <:bonk:720758421514878998>!'
                    )
                }

                if (
                    submissionMsg.author.id == msg.author.id &&
                    msg.author.id !== '306529453826113539'
                ) {
                    return msg.reply('dont grade urself stupid')
                }

                //add points and studff
                const buildingType = args[1].toUpperCase(),
                    quality = args[2],
                    userId = submissionMsg.author.id
                let basePoints
                if (buildingType == 'S') {
                    basePoints = 2
                } else if (buildingType == 'M') {
                    basePoints = 5
                } else if (buildingType == 'L') {
                    basePoints = 10
                }

                if (args[4]) {
                    collaborators = args[4]
                } else {
                    collaborators = 1
                }
                if (args[3]) {
                    incompletion = args[3]
                } else {
                    incompletion = 1
                }

                const timestamp = msg.createdTimestamp
                msg.reply(timestamp)
                const pointsTotal =
                    (basePoints * quality * incompletion) / collaborators
                const myQuery = `insert into submissions (msg_id, points_total, building_type, quality, incompletion, collaboration, user_id) values (${msgId}, ${pointsTotal}, '${buildingType}', ${quality}, ${incompletion}, ${collaborators}, ${userId})`

                //write to db
                con2.query(myQuery, (err, result) => {
                    if (err) throw err
                    msg.channel.send(
                        `SUCCESS YAY!!!<:HAOYEEEEEEEEEEAH:908834717913186414>\n\n<@${userId}> has gained **${pointsTotal} points!!!**\n\n*__Points breakdown:__*\nBuilding type: ${buildingType}\nQuality multiplier: ${quality}\nINCOMPLETION multiplier: ${incompletion}\nCollaborators: ${collaborators}`
                    )
                    submissionMsg.react('✅')
                })
            } catch (err) {
                msg.channel.send(
                    'ERROR HAPPENED IDOT!<:bonk:720758421514878998><:bonk:720758421514878998>\n' +
                        err
                )
            }
        }
    },
}
