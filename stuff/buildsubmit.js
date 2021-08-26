const { pingChannel } = require('../config.json')
const Discord = require('discord.js')

async function buildSubmit(message, client, con) {
    const msgChannel = await client.channels.fetch(pingChannel);
    const generalChannel = await client.channels.fetch('692799700985970719');

    if (message.content.includes('has been rejected!') || message.content.includes('has been accepted as builder!')) {
        const sentence = message.content.split('UUID:')
        let words = sentence[1].split(' ')
        let fullUuid = ''

        if (words[1] == undefined) return;
        console.log(words[1] + ' words 1 issisiisi')

        if (words[1].includes('[')) {
            const words1 = words[1].split('[')
            const actualUuid = words1.slice(0, -2)
            fullUuid = actualUuid[0]
        } else {
            fullUuid = words[1]
        }
        console.log('uuid ' + fullUuid)
        let userId = ''

        con.query(`SELECT * FROM discordsrv_accounts WHERE uuid = '${fullUuid}'`, async function (err, result, fields) {
            if (err) throw err;
            if (result[0] == undefined) return msgChannel.send(`${fullUuid}'s discord acc was not found in the database. <@306529453826113539>`);
            userId = result[0].discord
            const user = await client.users.fetch(userId)

            //build approved
            if (message.content.includes('has been accepted as builder!')) {
                generalChannel.send(`<@${userId}> is now a builder!`);
                msgChannel.send(`<@${userId}> is now a builder YAYAYYyayayyayyayayaYAYAYAYAYAY!!`)
                const user = await client.users.fetch(userId)
                const dm = await user.createDM()
                const embed = new Discord.MessageEmbed()
                    .setDescription(`**Your trial build was approved. Congrats, you're a BTE Canada builder! <a:crabrave:696890020056924233> <a:SPINNYCANADA:854075968096698398>**\n\nNow you can build anywhere in Canada! Remember to use tpll for your buildings, and be sure to update your building progress on our [progress map](https://discord.com/channels/692799601983488021/821890511760654366/857475153449058315).\n\n*Optional step:*\nIf you want to become an "official" BTE builder (you'll get the builder role in main BTE discord, but nothing else changes), you can submit the application form [here](https://buildtheearth.net/bte-canada)!`);

                dm.send(embed)
                    .catch(() => { msgChannel.send(`<@${userId} has DMs turned off? :scream_cat:`) })

                //add builder role, remove trialbuilder
                const member = await message.guild.members.fetch(userId)
                member.roles.add('692801758761844746')
                member.roles.remove('692802742200172634')
            };

            //build build denied
            if (message.content.includes('has been rejected!')) {
                msgChannel.send(`<@${userId}> got rejected!`)
                const dm = await user.createDM()
                dm.send(`Your trial build submission has been reviewed and declined (pretty much everyone's 1st builds are declined, so don't feel discouraged). Hop on the server and improve your build based on the **feedback** there, then resubmit it!\n\nIf you have any questions or concerns, feel free to ask in our discord server. <a:SPINNYCANADA:854075968096698398>`)
                    .catch(() => { msgChannel.send(`<@${userId}> has DMs turned off? :scream_cat:`) })
            }
        })
    }
    //build submitted
    if (message.content.includes('has submitted their build for review')) {
        const sentence = message.content.split('[Build Submit] ')
        const words = sentence[1].split(' ')
        const user = words[0]
        msgChannel.send(`${user} submitted a build! <@&825831754312712192>`) //ping reviewers
    }

    //build cancel
    if (message.content.includes('has cancelled their build submission')) {
        const sentence = message.content.split('[Build Submit] ')
        const words = sentence[1].split(' ')
        const user = words[0]
        msgChannel.send(`${user} cancelled their submission`)
    }
}

module.exports = buildSubmit