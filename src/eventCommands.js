require('dotenv').config({path:"../.env"});
const cacceOrganizzate = require('./firestore/cacceOrganizzate.js'); 
const ruoloTipoRuoloService = require('./firestore/ruoloTipoRuolo.js'); 
const ruoloTipoClasseService = require('./firestore/ruoloTipoClasse.js'); 
const memeService = require('./firestore/meme.js'); 


const utils = require('./utils.js'); 
const generics = require('./generics.js'); 
const { ButtonStyle } = require('discord.js');

module.exports = {
    async executeCommandsEvent(interaction, guild)
    {
      if(!interaction.isChatInputCommand()) return;
      
      const information = await ruoloTipoRuoloService.getGuardInformation(interaction,guild);

      switch(interaction.commandName)
      {
        case "start-caccia": await this.startCaccia(interaction,guild,information); break;
        case "set-classe": await this.setClasse(interaction,guild,information); break;
        case "set-type-user": await this.setSuperuser(interaction,guild,information); break;
        case "insert-meme": await this.insertMeme(interaction,guild,information); break;
        case "insert-meme": await this.insertMeme(interaction,guild,information); break;
        case "show-all-meme": await this.showAllMeme(interaction,guild,information); break;
        case "get-random-meme": await interaction.reply({content:"Ecco! "+ await memeService.getRandomMeme(guild.id)}); break;
        case "get-version": interaction.reply({content:"ROTBOT VERSION: __"+process.env.VERSION+"__", ephemeral:true});break;

      }
      return;
    },
  async startCaccia(interaction,guild,information)
  {
    if(!information.isUtente)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione", ephemeral:true});
      return;
    }
      
      const nomeDungeon= utils.dungeons.filter(x=> x.value==interaction.options.get('scegli-dungeon').value)[0].name;
      const cacceAttive=await cacceOrganizzate.getCacceOrganizzateDocument(true,interaction.guildId);
      if(cacceAttive==undefined || cacceAttive.length==0)
      {
        interaction.reply({
          content:"Non ci sono cacce programmate per questa sera",
          ephemeral:true
        });
        return;
      }
      const cacciaAttiva = utils.trovaDataPiùRecente(cacceAttive.filter(x=> x.destination===nomeDungeon));

      if(cacciaAttiva==undefined || cacciaAttiva.length==0)
      {
        interaction.reply({
          content:"Non ci sono cacce programmate per questa sera a "+nomeDungeon,
          ephemeral:true
        });
        return;
      }
      else
      {
        const name = interaction.user.globalName.replace("-","");
        const buttonStart=generics.creaButton(ButtonStyle.Primary,"Start!","button-start-"+name+"-"+nomeDungeon+"-"+cacciaAttiva.channelId+"-"+cacciaAttiva.messageId);
        interaction.reply({
          content:"Diamo il via alla tua caccia a "+nomeDungeon+", premi start quando sei pronto.",
          components:[buttonStart],
          ephemeral:true
        })
      }
  },
  async setClasse(interaction,guild,information)
  {
    if(!information.isAdmin)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione", ephemeral:true});
      return;
    }

    const { options } = interaction;
    const ruoloOption = options.getRole('ruolo').name;
    const classeOption = options.getString('classe');
    var classe=undefined;
    if(classeOption!=undefined)
      classe=utils.classiTM.filter(x=> x.name.toLowerCase()==classeOption.toLowerCase());
    else
    {
      await interaction.reply({content:"Non hai valorizzato correttamente il campo classe.",ephemeral:true});
      return;
    }

    if(classe==undefined || classe.length==0)
    {
      await interaction.reply({content:"Non esiste una classe simile su TM",ephemeral:true});
      return;
    }
    else
    {
      try
      {
        const response=await ruoloTipoClasseService.getRuoloTipoClasse(guild.id, ruoloOption,classeOption);
        if(response.length>0)
        {
          await interaction.reply({content:"Ruolo "+classe[0].type+" già mappato con classe "+response[0].tipoClasse+".",ephemeral:true})
          return;
        }
        await ruoloTipoClasseService.insertRuoloTipoclasse({role:ruoloOption,tipoClasse:classe[0].type,guild:guild})
        await interaction.reply({content:"Ho mappato "+classe[0].type+" e "+ruoloOption+".",ephemeral:true})
      }
      catch(error)
      {
        await interaction.reply({content:"Qualcosa è andato storto",ephemeral:true})
        console.log(error)
      }
    }

  },
  async setSuperuser(interaction,guild,information)
  {
    const isOwner = interaction.guild.ownerId === interaction.user.id;

    if(!information.isAdmin && !isOwner)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione", ephemeral:true});
      return;
    }

    const { options } = interaction;
    const ruolo = options.getRole('ruolo');
    const tipoRuolo = interaction.options.get('tipologia-ruolo').value;

    try
    {
      const response=await ruoloTipoRuoloService.getRuoloTipoRuolo(guild.id, ruolo,tipoRuolo);
        if(response.length>0)
        {
          await interaction.reply({content:"Ruolo "+ruolo.name+" già mappato con tipo ruolo "+tipoRuolo+".",ephemeral:true})
          return;
        }
      await ruoloTipoRuoloService.insertRuoloTipoRuolo({role:ruolo,tipoRuolo:tipoRuolo,guild:guild})
      await interaction.reply({content:"Ho mappato "+ruolo.name+" e "+tipoRuolo+".",ephemeral:true})
    }
    catch(error)
    {
      await interaction.reply({content:"Qualcosa è andato storto",ephemeral:true})
      console.log(error)
    }
  },
  async insertMeme(interaction,guild,information)
  {
    if(!information.isUtente)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione", ephemeral:true});
      return;
    }

    const { options } = interaction;
    const meme = options.getString('meme');
    try
    {
      await memeService.insertMeme({idGuild:guild.id, author:interaction.user.globalName,meme:meme})
      await interaction.reply({
        content:"Hai inserito correttamente: "+meme,
        ephemeral:true
      })
    }
    catch(error)
    {
      console.log("error")
    }
  },
  async showAllMeme(interaction,guild,information)
  {
    const embeds = new Array();
    const meme = await memeService.getAllMeme(guild.id)
    for(let i=0; i<meme.length;i++)
      embeds.push({
        name:(i+1)+"- "+meme[i].meme,
        value:"    ",})
            
    const result= await generics.creaEmbeded("Lista dei meme", "", interaction,embeds);
    try
    {
      await interaction.reply({
        content:"Ecco a te la lista dei meme del server!",
        embeds:[result]
      })
    }
    catch(error)
    {
      console.log(error);
    }
  }
}

