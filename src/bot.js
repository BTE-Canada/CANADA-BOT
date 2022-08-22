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

}

client.login(token)

client.once('ready', () => {
    run()
    console.log('uwu im here')
})
