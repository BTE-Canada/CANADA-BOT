module.exports = {
    name: 'role',
    cooldown: 1,
    needAdmin: true,
    async execute(msg, args, client) {
        const guildMembers = await msg.guild.members.fetch();
        guildMembers.every(user => msg.reply(user.id))
    }
}