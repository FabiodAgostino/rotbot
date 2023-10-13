const ruoloTipoRuoloService = require('./firestore/ruoloTipoRuolo.js'); 

module.exports = {
    async executeCommandsEvent(message, guild)
    {
        if(message.content.includes("!FirstInitializeAdmin"))
            this.firstInitializeAdmin(message,guild);
        return;
    },
    async firstInitializeAdmin(message,guild)
    {
        const isOwner = message.guild.ownerId === message.author.id;
        if(!isOwner)
        {
            await message.reply({
                content:"Non sei il proprietario del server.",
                ephemeral:true
            })
            return;
        }
        
        let getRole = message.content.split('-')[1];
        if(getRole!=undefined && getRole.length>0)
        getRole=getRole.match(/<@&(\d+)>/);
        else
        {
            await message.reply({
                content:"Stai sbagliando formato. (comando-@role)",
                ephemeral:true
            });
            return;
        }
        const roles = (await ruoloTipoRuoloService.getRuoloTipoRuolo(guild.id)).some(x=> x.tipoRuolo=="admin");
        const role = message.guild.roles.cache.get(getRole[1]);

        if(!roles)
        {
            try {
                await ruoloTipoRuoloService.insertRuoloTipoRuolo({role:role.name,tipoRuolo:"admin",guild:guild});
                await message.reply({
                content:"Inizializazione admin effettuata con successo.",
                ephemeral:true
                })
            } catch (error) {
            console.log(error)   ;
            }
        }
        else
            await message.reply({
                content:"Admin già associato ad un ruole.",
                ephemeral:true
                })
    }
}