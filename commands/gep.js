module.exports = {
    name: 'gep',
    cooldown: 1,
    needAdmin: false,
    execute(msg, args, client) {
        msg.channel.send('**Download:** https://www.google.com/earth/versions/download-thank-you/?usagestats=0 \n \n**Measuring tutorial (useful for measuring window lengths and stuff):** https://gyazo.com/d58446cec35cc504bb36b749346041a9\n\nPress CTRL+SHIFT+C to automatically **copy coords** at the mouse.\n\n**Elevation (equivalent to the y-level in-game)** is in the bottom right corner. Use this to measure building heights by finding the difference in elevation between the ground and the top of a building.');
    }
}