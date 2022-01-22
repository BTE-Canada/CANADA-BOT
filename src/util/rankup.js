const Discord = require('discord.js')
async function rankup(client, user, newPoints, i) {
    let pointsTotal = await client.redis.zscore('leaderboard', user.id)
    pointsTotal = parseFloat(pointsTotal)
    const guild = await client.guilds.fetch('692799601983488021')
    const guildMember = await guild.members.fetch(user.id)

    if (pointsTotal < 20 && pointsTotal + newPoints >= 20) {
        const embed = new Discord.MessageEmbed()
            .setTitle(
                `NEW RANK ACHIEVED! You're now a <a:SPINNYCANADA:854075968096698398> <a:crabrave:696890020056924233> Builder! <a:crabrave:696890020056924233> <a:SPINNYCANADA:854075968096698398>`
            )
            .setDescription(
                '__With the **Builder** rank, you can now build **Medium Builds!**__\n\nExamples: Department stores, strip malls, parking garages, marinas, schools, mid-rise apartments, small airports/harbors, etc!'
            )
        const dm = await user.createDM()

        dm.send({ embeds: [embed] }).catch((err) => {
            return `${user} has dms turned off or something went wrong while sending the dm! ${err}`
        })

        await guildMember.roles.add('928330780491542568')
        return i.followUp('user ranked up to builder!')
    } else if (pointsTotal < 150 && pointsTotal + newPoints >= 150) {
        const embed = new Discord.MessageEmbed()
            .setTitle(
                `NEW RANK ACHIEVED! You're now a <a:SPINNYCANADA:854075968096698398> <a:crabrave:696890020056924233> Senior Builder! <a:crabrave:696890020056924233> <a:SPINNYCANADA:854075968096698398>`
            )
            .setDescription(
                '__With the **Senior Builder** rank, you can now build **Large Builds!**__\n\nExamples: Skyscrapers, high-rises, convention centers, universities, large airports/harbours, etc!'
            )
        const dm = await user.createDM()

        dm.send({ embeds: [embed] }).catch((err) => {
            return `${user} has dms turned off or something went wrong while sending the dm! ${err}`
        })

        await guildMember.roles.add('928427735787913297')

        return i.followUp('user ranked up to senior builder!')
    } else if (pointsTotal < 500 && pointsTotal + newPoints >= 500) {
        console.log('hi')
        const embed = new Discord.MessageEmbed()
            .setTitle(
                `NEW RANK ACHIEVED! You're now a <a:SPINNYCANADA:854075968096698398> <a:crabrave:696890020056924233> Master Builder! <a:crabrave:696890020056924233> <a:SPINNYCANADA:854075968096698398>`
            )
            .setDescription(
                '__With the **Master Builder** rank, you can now build **Monumental Builds!**__\n\nExamples: Stadiums, amusement parks, megamalls, large medical or educational complexes, etc!'
            )
        const dm = await user.createDM()

        dm.send({ embeds: [embed] }).catch((err) => {
            return `${user} has dms turned off or something went wrong while sending the dm! ${err}`
        })

        await guildMember.roles.add('928331888089776198')

        return i.followUp('user ranked up to master builder!')
    } else {
        console.log('hihi')
    }
}

module.exports = rankup
