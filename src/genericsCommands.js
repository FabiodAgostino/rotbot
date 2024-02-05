require('dotenv').config({path:"../.env"});
const serverDiscordService = require('./firestore/serverDiscord.js'); 
const utils = require('./utils.js'); 
const commands = require('./commands.js'); 

module.exports = {

    async executeGenericsEvent(guild,client)
    {
        this.insertServerOnGuildCreate(guild,client);
    },
    async insertServerOnGuildCreate(guild,client)
    {
        const server =await serverDiscordService.getServer(guild.id);
        await commands.setCommands(guild.id);
        if(server==undefined || server.length==0)
        {
            
            await serverDiscordService.insertServer({idGuild:guild.id, name:guild.name});
            console.log(`Il bot è stato aggiunto al db. ${guild.name}`);
        }
        else
          console.log(`Il bot è gia presente nel db. ${guild.name}`);
    },
    async inviaMessaggioDM(userID, messaggio,client) {
        try {
            // Ottieni l'oggetto utente
            const utente = await client.users.fetch(userID);
    
            // Invia il messaggio diretto
            utente.send(messaggio);
    
            console.log(`Messaggio inviato con successo a ${utente.tag}`);
        } catch (errore) {
            console.error('Errore durante l\'invio del messaggio diretto:', errore);
        }
    }
}