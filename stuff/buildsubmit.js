const fetch = require('node-fetch');
const { pingChannel } = require('../config.json')

async function buildSubmit(message, client, con) {
    const msgChannel = await client.channels.fetch(pingChannel);
    const generalChannel = await client.channels.fetch('692799700985970719');

    if (message.content.includes('has been rejected!') || message.content.includes('has been accepted as builder!')) {
        const sentence = message.content.split('UUID:')
        let words = sentence[1].split(' ')
        let fullUuid = ''
        console.log(words)

        if (words[1] == undefined) return;

        if (words[1].includes('Sun')) {
            const words1 = words[1].split('\\')
            console.log('words1: ' + words1[0] + 'uwu')
            fullUuid = words1[0]
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

                const user = await client.users.fetch(userId)
                const dm = await user.createDM()
                dm.send('Your build was approved. Congrats, you are now a builder!')

                //add builder role, remove trialbuilder
                const member = await message.guild.members.fetch(userId)
                member.roles.add('692801758761844746')
                member.roles.remove('692802742200172634')
            };

            //build build denied
            if (message.content.includes('has been rejected!')) {
                msgChannel.send(`<@${userId}> got rejected!`)
                const dm = await user.createDM()
                dm.send('Your trial build submission has been declined. Take a look at the feedback, then improve your build and resubmit it!')
            }
        })
    }

    //build submit
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