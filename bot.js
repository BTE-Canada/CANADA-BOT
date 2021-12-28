const fs = require('fs')
const Discord = require('discord.js')
const { token, mysqlConnection2 } = require('./config.json')
const client = new Discord.Client()
const mysql = require('mysql2')

async function run() {
    client.commands = new Discord.Collection()
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
    })

    await con2.connect((err) => {
        if (err) throw err
        console.log('Connected to local mysql!!!!')
    })

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
