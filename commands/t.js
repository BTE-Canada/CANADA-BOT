const Discord = require("discord.js")

module.exports = {
    name: 't',
    cooldown: 1,
    needAdmin: false,
    async execute(msg, args, client) {
    const user = await client.users.fetch("306529453826113539")
    const dm = await user.createDM()

    const embed = new Discord.MessageEmbed()
        .setDescription(`**Your trial build was approved. Congrats, you're a BTE Canada builder! <a:crabrave:696890020056924233> <a:SPINNYCANADA:854075968096698398>**\n\nNow you can build anywhere in Canada! Remember to use tpll for your buildings, and be sure to update your building progress on our [progress map](https://discord.com/channels/692799601983488021/821890511760654366/857475153449058315).\n\n*Optional step:*\nIf you want to become an "official" BTE builder (you'll get the builder role in main BTE discord, but nothing else changes), you can submit the application form [here](https://buildtheearth.net/bte-canada)!`);
        
        dm.send(embed)
            .catch(() => { msgChannel.send(`<@${userId} has DMs turned off? :scream_cat:`)})    
    }
}
