const fetch = require('node-fetch');
const { pingChannel } = require('../config.json')

async function run(message, client, con) {
    const msgChannel = await client.channels.fetch(pingChannel);

    if (message.content.includes('review decline') || message.content.includes('review complete')) {
        const sentence = message.content.split('/')
        const words = sentence[1].split(' ')

        if (words[2] == undefined) return;

        function getId(playername) {
            return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`)
                .then(data => data.json())
                .then(player => player.id);
        }

        const id = await getId(words[2])
            .catch((err) => { return msgChannel.send(`error getting ${words[2]}'s mojang uuid: ${err}`) })

        if (typeof id != "string") {
            return msgChannel.send(`${words[2]}'s mojang uuid not found`)
        }

        //i hate how the plugin doesnt just use uuids in the firs tplace :facplam:
        const fullUuid = id.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5")
        let userId = ''

        con.query(`SELECT * FROM discordsrv_accounts WHERE uuid = '${fullUuid}'`, async function (err, result, fields) {
            if (err) throw err;
            if (result[0] == undefined) return msgChannel.send(`${words[2]}'s discord acc was not found in the database.`);
            userId = result[0].discord
            const user = await client.users.fetch(userId)

            //build approved
            if (message.content.includes('review complete')) {
                msgChannel.send(`<@${userId}> is now a builder!`);

                const user = await client.users.fetch(userId)
                const dm = await user.createDM()
                dm.send('Your build was approved. Congrats, you are now a builder!')

                //add builder role, remove trialbuilder
                const member = await message.guild.members.fetch(userId)
                member.roles.add('692801758761844746')
                member.roles.remove('692802742200172634')
            };

            //build build denied
            if (message.content.includes('review decline')) {
                msgChannel.send(`<@${userId}> got rejected!`)
                const dm = await user.createDM()
                dm.send('Your trial build submission has been declined. Take a look at the feedback, then improve your build and resubmit it!')
            }
        })
    }

    //build submit
    if (message.content.includes('has submitted their plot for review')) {
        const sentence = message.content.split('] ')
        const words = sentence[1].split(' ')
        const user = words[0]
        msgChannel.send(`${user} submitted a build! <@&825831754312712192>`) //ping reviewers
    }
}

module.exports = run