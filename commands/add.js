module.exports = {
    name: 'add',
    cooldown: 1,
    needAdmin: true,
    async execute(msg, args, client, con, con2) {
        const canadaServer = await client.guilds.fetch('692799601983488021')

        const Role = canadaServer.roles.cache.find(role => role.name == "Builder");
        const Members = canadaServer.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.id);
        console.log(`Users with ${Role.name}: ${Members}`);

        Members.forEach(member => {
            const myQuery = `insert into players (user_id) values ('${member}')`
            con2.query(myQuery, (err, result) => {
                if (err) throw err;
            })
        });
        msg.channel.send('hi added everyone to the db uayYAYAYAYAY!')
    }
}