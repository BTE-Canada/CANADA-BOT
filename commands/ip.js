module.exports = {
    name: 'ip',
    aliases: ['ipenis'],
    cooldown: 1,
    needAdmin: false,
    execute(msg, args, client) {
        msg.channel.send('**Java ip:** btecanada.sparked.network\n**Bedrock ip:** bedrock is currently dead because 1.17 broke it. :frowning:\n\nModpack download in <#776176449849393162>');
    }
}