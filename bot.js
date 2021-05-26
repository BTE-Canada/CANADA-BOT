const fs = require('fs')
const Discord = require('discord.js')
const { token, mysqlConnection } = require('./config.json')
const client = new Discord.Client()

var id = "f8e0dccaae7549879538c1d9e2c263cb";

async function run() {
    //command stuff 
    client.commands = new Discord.Collection()
    const commandFiles = fs
        .readdirSync('./commands')
        .filter((file) => file.endsWith('.js'))

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`)
        client.commands.set(command.name, command)
    }

    const mysql = require('mysql');
    const con = mysql.createConnection({
        host: mysqlConnection[0],
        user: mysqlConnection[1],
        password: mysqlConnection[2],
        database: mysqlConnection[3]
    });
    await con.connect((err) => {
        if (err) throw err;
        console.log('Connected!');
    });


    //event stuff
    const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client, con));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client, con));
        }
    }
}
run()

client.login(token)

client.once('ready', () => {
    console.log('uwu im here')
})
