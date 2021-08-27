module.exports = {
    name: 'see',
    cooldown: 1,
    needAdmin: false,
    async execute(msg, args, client, con, con2) {
        const userId = args[0];

        con2.query(`select count(*), sum(points_total) from submissions where user_id = '${userId}'`, (err, result) => {
            console.log(result)
            msg.reply(`<@${userId} has submitted :sparkles: **${result[0]['count(*)']}** :sparkles:  builds so far!\n\n<@${userId}>'s total number of points is :tada: ***${result[0]['sum(points_total)']}*** :tada: !!!`);
        })
    }
}