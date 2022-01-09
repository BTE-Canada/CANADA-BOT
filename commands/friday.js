module.exports = {
    name: 'friday', 
    aliases : ['isitfriday', 'friyay', 'OMG?'], 
    cooldown : 10, 
    needAdmin : false, 
    execute(msg, args, client){
        const d = new Date();
        let day = d.getDay();
        if (day == 5) {
            msg.channel.send("OMG OMG OMG OMG OMG OMG OMG OMG!!!! :scream_cat:"); 
            msg.channel.send("IT'S ***FRIDAY***!!!!!!!!!!!!!!! YAYAYAYAYAYAYAYAYAY"); 
            msg.channel.send("<@306529453826113539><@306529453826113539><@306529453826113539><@306529453826113539><@306529453826113539>"); 
        }
        else{ 
            let m = ""; 
            switch(day){
                case 0: 
                    m = "Sunday"; 
                    break; 
                case 1: 
                    m = "Monday"; 
                    break; 
                case 2:
                    m ="Tuesday"; 
                    break; 
                case 3:
                    m = "Wednesday"; 
                    break; 
                case 4: 
                    m = "Thursday"; 
                    break; 
                case 6: 
                    m = "Saturday"; 
                    break; 
                default:
                    m="ERROROROOROR FAILURE!!!!!!!!!!!!!!!!!!!!!!"; 
                    break; 
            }
            let d_left = 5-day; 
            if (day ==6) d_left = 6; 
            msg.channel.send(`:pleading_face: Sowwy senpai, it's actually ${m}! There's still *${d_left} days* left before friday 😦`); 
        }
    }
}
