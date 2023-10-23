const serverDiscordService = require('./firestore/serverDiscord.js'); 
const commands = require('./commands.js'); 


module.exports = {
    async executeMessageEvent(message)
    {
      if(message.content[0]!="!")
        return;
     console.log()   
      switch(message.content)
      {
        case "!update-commands": await this.updateAllCommands(message); break;
      }
      return;
    },
    async updateAllCommands(message)
    {
        const isNotAdmin=message.author.username!=="yoridyonenloke";
        if(isNotAdmin)
        {
            console.log("TENTATIVO DI AGGIORNAMENTO NON ESEGUITO DA TE.");
            return;
        }

        const servers=await serverDiscordService.getAllServers();
        servers.forEach(async server=>{
            await commands.setCommands(server.id);
        })
        return;
    }
};