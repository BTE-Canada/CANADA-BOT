module.exports = {
    name: 'see',
    cooldown: 1,
    needAdmin: false,
    async execute(msg, args, client, con2) {
        if (args[0] == undefined || args[0].includes('@'))
            return msg.reply(
                'you must specify a valid USER ID!<:bonk:720758421514878998> `=see [user id]`'
            )
        const result = await client.con
            .promise()
            .query(
                `select count(*), sum(points_total) from submissions where user_id = ?`,
                [args[0]]
            )

        let pointsTotal
        if (result[0][0]['sum(points_total)'] == null) {
            pointsTotal = 0
        } else {
            pointsTotal = parseFloat(result[0][0]['sum(points_total)'])
        }
        msg.channel.send(
            `<@${args[0]}> has submitted :sparkles: **${result[0][0]['count(*)']}** :sparkles:  builds so far!\n\n<@${args[0]}>'s total number of points is :tada: ***${pointsTotal}*** :tada: !!!`
        )
    },
}
