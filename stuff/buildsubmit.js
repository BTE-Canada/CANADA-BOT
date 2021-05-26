const fetch = require('node-fetch');
const { pingChannel } = require('../config.json')

async function run(message, client, con) {
    const msgChannel = await client.channels.fetch(pingChannel);

    //build submit
    if (message.content.includes('submitted a build')) {
        const sentence = message.content.split(': ')
        const words = sentence[1].split(' ')
        const user = words[0]
        msgChannel.send(user + ' submitted a bJuild!')
    }
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

            if (result == undefined) return;
            userId = result[0].discord

            msgChannel.send(`<@${userId}> is now a builder!`);

            const user = await client.users.fetch(userId)

            //DM user
            const dm = await user.createDM()
            dm.send('Your build was approved. Congrats, you are now a builder!')

            //update to builder role
            const member = await message.guild.members.fetch(userId)
            member.roles.add('692801758761844746')
            member.roles.remove('692802742200172634')
        });
    }

    /* //build deny
     if (message.content.includes('denied')) {
         const sentence = message.content.split(': ')
         const words = sentence[1].split(' ')
         const user = words[0]
         msgChannel.send(user + ' got rejected!')
     }*/
}

module.exports = run