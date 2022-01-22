const { rejectChannel } = require('../../config.json')
const Discord = require('discord.js')

async function reject(client, msg) {
    const embed = new Discord.MessageEmbed()
        .setTitle(`INCORRECT SUBMISSION FORMAT.`)
        .setDescription(
            '**[Correct format:](https://discord.com/channels/692799601983488021/880661113958711336/928067390158286918)**\n[Build count]\n[Coordinates]\n[Location name] (OPTIONAL)\n[Image(s) of build]\n\n__The entire submission must be in ONE MESSAGE!__\nView [pinned message](https://discord.com/channels/692799601983488021/880661113958711336/928067390158286918) for more details.'
        )

    const channel = await client.channels.fetch(rejectChannel)
    const rejectionMsg = await channel.send({ embeds: [embed] })

    setTimeout(() => {
        rejectionMsg.delete()
        msg.delete()
    }, 30000)
}

async function checkFormat(client, msg) {
    // check for images
    if (msg.attachments.size === 0) {
        return reject(client, msg)
    }

    // ensure there are at least 2 lines (# and coords)
    const lines = msg.content.split('\n')

    if (lines.length < 2) {
        return reject(client, msg)
    }

    // coordinates regex
    const regexExp =
        /^\s*[(]?[-+]?([1-8]+\d\.(\d+)?|90(\.0+))\xb0?,?\s+[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]+\d))\.(\d+))\xb0?\s*/

    let coords = false
    let count = false

    // check content of each line for either count (including range x-z) or coords
    lines.forEach((line) => {
        line = line.replace(/#/g, '')
        if (regexExp.test(line) === true) {
            coords = true
        } else if (!isNaN(line) && Number.isInteger(Number(line))) {
            count = true
        } else if (
            line.includes('-') &&
            line.split('-').length === 2 &&
            !isNaN(line.replace('-', ''))
        ) {
            count = true
        }
    })

    if (coords !== true || count !== true) {
        reject(client, msg)
    }
}

module.exports = checkFormat
