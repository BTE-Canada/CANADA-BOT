const fs = require('fs')
const Discord = require('discord.js')
const { token, mysqlConnection } = require('./config.json')
const client = new Discord.Client()
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: '192.168.1.144',
    user: 'canadabot',
    password: 'Canada6!'
});

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

    const con = mysql.createConnection({
        host: mysqlConnection[0],
        user: mysqlConnection[1],
        password: mysqlConnection[2],
        database: mysqlConnection[3]
    });
    const con2 = mysql.createConnection({
        host: '192.168.1.144',
        user: 'canadabot',
        password: 'Canada6!',
        database: 'points'
    });
    await con.connect((err) => {
        if (err) throw err;
        console.log('Connected to canada mysql!!!!');
    });
    await con2.connect((err) => {
        if (err) throw err;
        console.log('Connected to my mysql!!!!');
    });

    //event stuff
    const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client, con, con2));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client, con, con2));
        }
    }


    //TEMP STUFF

}
run()

client.login(token)

client.once('ready', () => {
    console.log('uwu im here')
})
