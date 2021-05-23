const fs = require('fs')
const Discord = require('discord.js')
const { token } = require('./config.json')
const client = new Discord.Client()

//command stuff 
client.commands = new Discord.Collection()
const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}


//event stuff
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(token)

client.once('ready', () => {
    console.log('uwu im here')
})
