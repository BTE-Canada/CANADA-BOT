const fs = require('fs')
const { Collection, Client, Intents } = require('discord.js')
const { token, mysqlConnection2 } = require('./config.json')
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
    ],
})
const mysql = require('mysql2')

async function run() {
    client.slashCmds = new Collection()
    const slashCmdFiles = fs
        .readdirSync('./slash')
        .filter((file) => file.endsWith('.js'))

    for (const file of slashCmdFiles) {
        const command = require(`./slash/${file}`)
        client.slashCmds.set(command.data.name, command)
    }

    //------------ normal commands

    client.commands = new Collection()
    const commandFiles = fs
        .readdirSync('./commands')
        .filter((file) => file.endsWith('.js'))

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    }

    const con2 = mysql.createConnection({
        host: mysqlConnection2[0],
        user: mysqlConnection2[1],
        password: mysqlConnection2[2],
        database: mysqlConnection2[3],
        multipleStatements: true,
    })

    await con2.connect((err) => {
        if (err) throw err
        console.log('Connected to local mysql!!!!')
    })

    client.con = con2

    //event stuff
    const eventFiles = fs
        .readdirSync('./events')
        .filter((file) => file.endsWith('.js'))

    for (const file of eventFiles) {
        const event = require(`./events/${file}`)
        if (event.once) {
            client.once(event.name, (...args) =>
                event.execute(...args, client, con2)
            )
        } else {
            client.on(event.name, (...args) =>
                event.execute(...args, client, con2)
            )
        }
    }
}
run()

client.login(token)

client.once('ready', () => {
    console.log('uwu im here')
})
