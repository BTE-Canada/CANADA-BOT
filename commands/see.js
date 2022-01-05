module.exports = {
    name: 'see',
    cooldown: 1,
    needAdmin: false,
    async execute(msg, args, client, con2) {
        if (args[0] == undefined) return msg.reply('you must specify a user!<:bonk:720758421514878998> `=see [user id]`')
        con2.query(`select count(*), sum(points_total) from submissions where user_id = '${args[0]}'`, (err, result) => {
            let points_total;
            if(result[0]['sum(points_total)'] == null) {
                points_total = 0
            } else {
                points_total = parseFloat(result[0]['sum(points_total)'])
            }
            msg.channel.send(`<@${args[0]}> has submitted :sparkles: **${result[0]['count(*)']}** :sparkles:  builds so far!\n\n${args[0]}'s total number of points is :tada: ***${points_total}*** :tada: !!!`);
        })
    }
}