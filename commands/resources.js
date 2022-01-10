module.exports = { 
    name: "res", 
    aliases: ["resources", "read_the_channels"], 
    cooldown: 2, 
    needAdmin: false, 
    execute(msg, args, client) { 
        switch(args[0].toLowerCase()) {
            case "mods": 
                msg.channel.send("Here are some useful mods!\nhttps://discord.com/channels/692799601983488021/821890511760654366/822924519181647923"); 
                break; 
            case "brush": 
                msg.channel.send("Wondering how to do a :sparkles: tree brush? :sparkles:\nhttps://discord.com/channels/692799601983488021/821890511760654366/823671457418575882"); 
                break; 
            case "skyscrapers": 
            case "glass": 
                msg.channel.send("***SKYSCRAPER GUIDE!***\nhttps://discord.com/channels/692799601983488021/821890511760654366/836981496001855558"); 
                break; 
            case "heads": 
                msg.channel.send("Want head :smirk_cat:?\nhttps://discord.com/channels/692799601983488021/821890511760654366/847305677570441277"); 
                break; 
            case "map": 
                msg.channel.send("__PROGRESS MAP__\nhttps://discord.com/channels/692799601983488021/821890511760654366/857475153449058315"); 
                break; 
            case "probuilder": 
                msg.channel.send("Will this ever get used? nah\nhttps://discord.com/channels/692799601983488021/821890511760654366/886800476912386049"); 
                break; 
            case "measure": 
            case "ruler": 
                msg.channel.send(":straight_ruler: moment\nhttps://gyazo.com/d58446cec35cc504bb36b749346041a9"); 
                break; 
            case "gb": 
            case "guidebook": 
                msg.channel.send("Official BTE guidebook: \nhttps://docs.google.com/document/d/1bZ6BLvMycPiMboRtQ2UysC4wC5HcUdLbKHtzJwpgtE0/view#"); 
                break; 
            case "detail": 
            case "detailing_guidebook": 
                msg.channel.send("***NYA!*** THE DETAILING GUIDEBOOK: \nhttps://docs.google.com/document/d/1MlseHc18IvSbAIEWgbR-Q1p5v4QTOXZ04Y2NyTk_7Dg/edit");
                break; 
            default: 
                msg.channel.send(`:thinking: I don't know what you want me to show you :sob: :sob: !
The arguments I accept are the following ["mods", "brush", "skyscrapers"||"glass", "heads", "map", "probuilder", "gb"||"guidebook", "detail"||"detailling_guidebook"]`);
                break; 
        }
    }
}