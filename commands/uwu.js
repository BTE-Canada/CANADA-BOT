module.exports = {
    name: 'uwu',
    cooldown: 3,
    needAdmin: true,
    async execute(msg, args, client, con, con2) {
        //check for command syntax corerct
        if (args.length < 5 || args.length > 6 || args[1].length > 1) {
            return msg.channel.send('command syntax failure!! ARHGGGGGGGGGGGG!\n\nCommand usage:\n`=uwu [submission link] [S/M/L] [quality] [incompletion] [inaccuracy] [collaborators]`')
        }
        const checkArray = [args[2], args[3], args[4], args[5]]
        const checkResult = checkArray.some(e => isNaN(e));
        if (checkResult == true) {
            return msg.channel.send('the multipliers need to be numbers!\n\nCommand usage:\n`=uwu [submission link] [S/M/L] [quality] [incompletion] [inaccuracy] [collaborators]`')
        }



        //put stuff into variables
        try {
            const theChannel = await client.channels.fetch('880661113958711336')
            const msgId = args[0].substring(args[0].length - 18)
            const submissionMsg = await theChannel.messages.fetch(msgId)

            //check for duplicate
            if (submissionMsg.reactions.cache.has('✅')) return msg.reply('that one already got graded !')

            //add points and studff
            const buildingType = args[1].toLowerCase(), quality = args[2], incompletion = args[3], inaccuracy = args[4], collaborators = args[5], userId = submissionMsg.author.id;
            let basePoints;
            if (buildingType == 's') {
                basePoints = 2
            } else if (buildingType == 'm') {
                basePoints = 5
            } else if (buildingType == 'l') {
                basePoints = 10
            }

            const pointsTotal = (basePoints * quality * incompletion * inaccuracy) / collaborators;
            //write to db 
            const myQuery = `insert into submissions (msg_id, points_total, building_type, quality, incompletion, inaccuracy, collaboration, user_id) values (${msgId}, ${pointsTotal}, '${buildingType}', ${quality}, ${incompletion}, ${inaccuracy}, ${collaborators}, ${userId})`
            con2.query(myQuery, (err, result) => {
                if (err) throw err;
                msg.channel.send(`SUCCESS YAY!!!\n\n<@${userId}> has gained **${pointsTotal} points!!!**\n\n*__Points breakdown:__*\nBuilding type: ${buildingType}\nQuality multiplier: ${quality}\nincompletion multiplier: ${incompletion}\nInaccuracy multiplier: ${inaccuracy}\nCollaborators: ${collaborators}`)
                submissionMsg.react('✅')
            })
        }
        catch (err) {
            msg.channel.send('ERROR HAPPENED IDOT!\n' + err)
        }

    }
}