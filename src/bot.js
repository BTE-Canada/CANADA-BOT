const fs = require('fs')
const { Collection, Client, Intents } = require('discord.js')
const { token } = require('../config.json')
const db = require('./util/db')
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
    ],
})

async function run() {
    db(client)

    // slash commands
    client.slashCmds = new Collection()
    const slashCmdFiles = fs
        .readdirSync('./slash')
        .filter((file) => file.endsWith('.js'))

    for (const file of slashCmdFiles) {
        const command = require(`./slash/${file}`)
        client.slashCmds.set(command.data.name, command)
    }

    // normal commands
    client.commands = new Collection()
    const commandFiles = fs
        .readdirSync('./commands')
        .filter((file) => file.endsWith('.js'))

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    }

    // register events
    const eventFiles = fs
        .readdirSync('./events')
        .filter((file) => file.endsWith('.js'))

    for (const file of eventFiles) {
        const event = require(`./events/${file}`)
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client))
        } else {
            client.on(event.name, (...args) => event.execute(...args, client))
        }
    }
}

client.login(token)

client.once('ready', () => {
    run()
    console.log('uwu im here')
})
