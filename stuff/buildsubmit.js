const fetch = require('node-fetch');
const { pingChannel } = require('../config.json')

async function run(message, client, con) {
    const msgChannel = await client.channels.fetch(pingChannel);
    //build approved
    if (message.content.includes('build approve') || message.content.includes('build deny')) {
        const sentence = message.content.split('/')
        const words = sentence[1].split(' ')
        const username = words[2]

        function getId(playername) {
            return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`)
                .then(data => data.json())
                .then(player => player.id);
        }

        const id = await getId(username)
        const fullUuid = id.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5")

        let userId = ''
        con.query(`SELECT * FROM discordsrv_accounts WHERE uuid = '${fullUuid}'`, async function (err, result, fields) {
            if (err) throw err;
            if (result == undefined) return msgChannel.send('User was not found in the database.');
            userId = result[0].discord

            //build approved
            if (message.content.includes('build approve')) {
                msgChannel.send(`<@${userId}> is now a builder!`);

                const user = await client.users.fetch(userId)
                const dm = await user.createDM()
                dm.send('Your build was approved. Congrats, you are now a builder!')

                //update to builder role
                const member = await message.guild.members.fetch(userId)
                member.roles.add('692801758761844746')
                member.roles.remove('692802742200172634')
            };

            //build build denied
            if (message.content.includes('build deny')) {
                msgChannel.send(`<@${userId}> got rejected!`)
                const dm = await user.createDM()
                dm.send('Your build was denied. Take a look at the feedback, then improve your build and submit it again!')
            }
        })
    }

    //build submit
    if (message.content.includes('submitted a build')) {
        const sentence = message.content.split(': ')
        const words = sentence[1].split(' ')
        const user = words[0]
        msgChannel.send(user + ' submitted a bJuild!')
    }
}

module.exports = run