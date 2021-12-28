module.exports = {
    name: 'me',
    cooldown: 1,
    needAdmin: false,
    async execute(msg, args, client, con2) {
        con2.query(`select count(*), sum(points_total) from submissions where user_id = '${msg.author.id}'`, (err, result) => {
            let points_total;
            if(result[0]['sum(points_total)'] == null) {
                points_total = 0
            } else {
                points_total = result[0]['sum(points_total)']
            }
            msg.reply(`you have completed :sparkles: **${result[0]['count(*)']}** :sparkles: build(s) so far!\n\nyour total number of points is :tada: ***${points_total}*** :tada: !!!`);
        })
    }
}