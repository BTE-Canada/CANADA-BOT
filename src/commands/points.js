module.exports = {
    name: 'points',
    aliases: ['p', 'me'],
    cooldown: 2,
    needAdmin: false,
    async execute(msg, args, client) {
        const result = await client.con
            .promise()
            .query(
                `select count(*), sum(points_total) from submissions where user_id = ?`,
                [msg.author.id]
            )

        let pointsTotal

        if (result[0][0]['sum(points_total)'] == null) {
            pointsTotal = 0
        } else {
            pointsTotal = parseFloat(result[0][0]['sum(points_total)'])
        }
        msg.reply(
            `you have completed :sparkles: **${result[0][0]['count(*)']}** :sparkles: build(s) so far!\n\nyour total number of points is :tada: ***${pointsTotal}*** :tada: !!!`
        )
    },
}
