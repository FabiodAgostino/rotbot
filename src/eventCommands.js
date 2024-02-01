require('dotenv').config({path:"../.env"});
const cacceOrganizzate = require('./firestore/cacceOrganizzate.js'); 
const ruoloTipoRuoloService = require('./firestore/ruoloTipoRuolo.js'); 
const ruoloTipoClasseService = require('./firestore/ruoloTipoClasse.js'); 
const skillsService = require('./firestore/skills.js'); 
const contestService = require('./firestore/contest.js'); 
const memeService = require('./firestore/meme.js'); 
const utils = require('./utils.js'); 
const modals = require('./modals.js'); 
const generics = require('./generics.js'); 
const { ButtonStyle,ComponentType,ActionRowBuilder,ButtonBuilder } = require('discord.js');

module.exports = {
    async executeCommandsEvent(interaction, guild,information)
    {
      if(!interaction.isChatInputCommand()) return;
      

      switch(interaction.commandName)
      {
        case "start-caccia": await this.startCaccia(interaction,guild,information); break;
        case "insert-caccia-manuale": await this.insertCacciaContest(interaction,guild,information); break;
        case "set-classe": await this.setClasse(interaction,guild,information); break;
        case "set-type-user": await this.setSuperuser(interaction,guild,information); break;
        case "set-validatore": await this.setValidatori(interaction,guild,information); break;
        case "valida-immagini": await this.validaImmagine(interaction,guild,information); break;
        case "insert-meme": await this.insertMeme(interaction,guild,information); break;
        case "insert-segnalazione": await this.insertSegnalazione(interaction,guild,information); break;
        case "show-all-meme": await this.showAllMeme(interaction,guild,information); break;
        case "show-skills-guild": await this.showAllSkills(interaction,guild,information); break;
        case "show-my-skills": await this.showMySkills(interaction,guild,information); break;
        case "get-meme-by-word": await this.getMemeByWord(interaction,guild,information); break;
        case "get-leaderboard": await this.getLeaderBoard(interaction,guild,information); break;
        case "insert-update-skills": await this.insertOrUpdateSkills(interaction,guild,information); break;
        case "get-random-meme": await interaction.reply({content:await memeService.getRandomMeme(guild.id)+" "+ utils.getRandomEmojiRisposta()}); break;
        case "get-version": interaction.reply({content:"ROTBOT VERSION: __"+utils.VERSION+"__ ⭐", ephemeral:true});break;
      }
      return;
    },
  async startCaccia(interaction,guild,information)
  {
    if(!information.isUtente)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
      return;
    }
      await interaction.deferReply({ ephemeral: true }); 
      const nomeDungeon= utils.dungeons.filter(x=> x.value==interaction.options.get('scegli-dungeon').value)[0].name;
      let cacceAttive=(await cacceOrganizzate.getCacceOrganizzateDocument(true,interaction.guildId,nomeDungeon)).filter(x=> x.finita==false);
      
      if(cacceAttive==undefined || cacceAttive.length==0)
      {
        interaction.editReply({
          content:"Non ci sono cacce programmate a "+nomeDungeon+" "+ utils.getRandomEmojiRisposta(),
          ephemeral:true
        });
        return;
      }
      cacceAttive = cacceAttive.filter(x=> x.destination===nomeDungeon);
      let cacciaAttiva = utils.trovaDataPiùRecente(cacceAttive);

      let name;
        if(interaction.user.globalName)
          name = interaction.user.globalName.replace("-","");
        else
          name = interaction.user.username;
        
        const buttonStart=generics.creaButton(ButtonStyle.Primary,"Start!","button-start-"+cacciaAttiva.id);
        await interaction.editReply({
          content:"Diamo il via alla tua caccia a "+nomeDungeon+", premi start quando sei pronto. "+ utils.getRandomEmojiFelici(),
          components:[buttonStart],
          ephemeral:true
        })
  },
  async insertCacciaContest(interaction, guild, information) {
    if (!information.isAdmin) {
        await interaction.reply({ content: "Solo i ruoli settati come admin possono accedere a questa funzionalità! 😡", ephemeral: true });
        return;
    }
    const nomeDungeon = utils.dungeons.filter(x => x.value == interaction.options.get('scegli-dungeon').value)[0].name;
    if(!nomeDungeon)
      return;

    await interaction.showModal(modals.modaleStopCaccia(interaction.id));
    const submitted = await interaction.awaitModalSubmit({
      filter: async (i) => {
          const filter =
              i.user.id === interaction.user.id &&
              i.customId === `modaleStopCaccia-${interaction.id}`;
          if (filter) {
              await i.deferReply({ephemeral:true});
          }
          return filter;
      },
      time: 100000,
    }).catch(async x=>{
          await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
          return;
    });
    if(submitted===undefined)
      return;

    if (submitted) {
      const fields = submitted.fields;
      const soldi=fields.getTextInputValue("soldi");
      const frammenti=fields.getTextInputValue("frammenti");
      const fama=fields.getTextInputValue("fama");
      const nucleiFormidabili=fields.getTextInputValue("nucleiFormidabili");
      const sangue=fields.getTextInputValue("sangue");

      const newData = {
        fama: fama,
        monete: soldi,
        frammenti: frammenti,
        nuclei: nucleiFormidabili,
        sangue: sangue,
        finita:false}

    try
        {
            const id=await cacceOrganizzate.insertCacciaTempoLoot({author:information.author,destination:nomeDungeon,guild:guild,messageId:"",channelId:""},true,newData);
            const avanti = generics.creaButton(ButtonStyle.Success,"Avanti","step2-"+id);
            if (submitted) {
                await submitted.editReply({
                    content:"Procedi nell'inserimento della caccia andando allo step 2! "+utils.getRandomEmojiFelici(),
                    components:[avanti],
                    ephemeral:true,
                    fetchReply:true
                });
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }
  return;
      

},
  async setClasse(interaction,guild,information)
  {
    if(!information.isAdmin)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
      return;
    }
    await interaction.deferReply({ ephemeral: true }); 
    const { options } = interaction;
    const ruoloOption = options.getRole('ruolo').name;
    const classeOption = options.getString('classe');
    var classe=undefined;
    if(classeOption!=undefined)
      classe=utils.classiTM.filter(x=> x.name.toLowerCase()==classeOption.toLowerCase());
    else
    {
      await interaction.editReply({content:"Non hai valorizzato correttamente il campo classe. "+ utils.getRandomEmojiFelici(),ephemeral:true});
      return;
    }

    if(classe==undefined || classe.length==0)
    {
      await interaction.editReply({content:"Non esiste una classe simile su TM "+ utils.getRandomEmojiFelici(),ephemeral:true});
      return;
    }
    else
    {
      try
      {
        const response=await ruoloTipoClasseService.getRuoloTipoClasse(guild.id, ruoloOption,classeOption);
        if(response.length>0)
        {
          await interaction.editReply({content:"Ruolo "+classe[0].type+" già mappato con classe "+response[0].tipoClasse+".",ephemeral:true})
          return;
        }
        await ruoloTipoClasseService.insertRuoloTipoclasse({role:ruoloOption,tipoClasse:classe[0].type,guild:guild})
        await interaction.editReply({content:"Ho mappato "+classe[0].type+" e "+ruoloOption+".",ephemeral:true})
      }
      catch(error)
      {
        await interaction.editReply({content:"Qualcosa è andato storto",ephemeral:true})
        console.log(error)
      }
    }

  },
  async setSuperuser(interaction,guild,information)
  {
    const isOwner = interaction.guild.ownerId === interaction.user.id;
    if(!information.isAdmin && !isOwner)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
      return;
    }
    await interaction.deferReply({ ephemeral: true }); 
    const { options } = interaction;
    const ruolo = options.getRole('ruolo');
    const tipoRuolo = interaction.options.get('tipologia-ruolo').value;
    try
    {
      const response=await ruoloTipoRuoloService.getRuoloTipoRuolo(guild.id, ruolo,tipoRuolo);
        if(response.length>0)
        {
          await interaction.editReply({content:"Ruolo "+ruolo.name+" già mappato con tipo ruolo "+tipoRuolo+".",ephemeral:true})
          return;
        }
      await ruoloTipoRuoloService.insertRuoloTipoRuolo({role:ruolo,tipoRuolo:tipoRuolo,guild:guild})
      await interaction.editReply({content:"Ho mappato "+ruolo.name+" e "+tipoRuolo+".",ephemeral:true})
    }
    catch(error)
    {
      await interaction.editReply({content:"Qualcosa è andato storto",ephemeral:true})
      console.log(error)
    }
  },
  async setValidatori(interaction,guild,information)
  {
    const isOwner = interaction.guild.ownerId === interaction.user.id;
    const isTheMiracleServer = guild.id===process.env.GUILD_ID_TM;
    if(!isTheMiracleServer)
    {
      await interaction.reply({content:"Non sei su TMZ! 😡", ephemeral:true});
      return;
    }
    if(!information.isAdmin && !isOwner)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
      return;
    }
    

    await interaction.deferReply({ ephemeral: true }); 
    const { options } = interaction;
    const user = options.getUser('validatore');
    try
    {
      const response=await ruoloTipoRuoloService.getValidatori();
        if(response.filter(x=> x.idUser==user.id).length>0)
        {
          await interaction.editReply({content:"L'utente "+user.username+" è già mappato come validaore.",ephemeral:true})
          return;
        }
      await ruoloTipoRuoloService.insertRuoloValidatore(user)
      await interaction.editReply({content:"Ho inserito "+user.username+" come validatore.",ephemeral:true})
    }
    catch(error)
    {
      await interaction.editReply({content:"Qualcosa è andato storto",ephemeral:true})
      console.log(error)
    }
  },
  async insertMeme(interaction,guild,information)
  {
    if(!information.isUtente)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
      return;
    }
    await interaction.deferReply({ ephemeral: true });   
    const { options } = interaction;
    const meme = options.getString('meme');
    
    if(meme.includes("https://discord.com/channels/"))
    {
      await interaction.editReply({
        content:"Stai provando ad inserire un tag ad un channel al posto di un'immagine! "+ utils.getRandomEmojiRisposta(),
        ephemeral:true
      });
      return;
    }

    try
    {
      await memeService.insertMeme({idGuild:guild.id, author:interaction.user.globalName,meme:meme})
      await interaction.editReply({
        content:"Hai inserito correttamente: "+meme+" "+ utils.getRandomEmojiRisposta(),
        ephemeral:true
      })
    }
    catch(error)
    {
      console.log("error")
    }
  },
  async insertSegnalazione(interaction,guild,information)
  {
    if(!information.isUtente)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
      return;
    }
    await interaction.deferReply({ ephemeral: true });   
    const choice=interaction.options.get('tipologa').value
    const { options } = interaction;
    const testo = options.getString('testo');
    try
    {
      await memeService.insertTicket({idGuild:guild.id, author:interaction.user.globalName,type: choice, text:testo})
      await interaction.editReply({
        content:"Il tuo ticket di tipo "+choice+" è stato inserito correttamente! "+ utils.getRandomEmojiFelici(),
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
    const meme = (await memeService.getAllMeme(guild.id)).filter(x=> !x.meme.includes("http"))
    for(let i=0; i<meme.length;i++)
      embeds.push({
        name:(i+1)+"- "+meme[i].meme+"\n",
        value:"    ",})


    await interaction.deferReply({ ephemeral: true });   
    const result = embeds.map(x => x.name).toString().replace(/,/g, "");
    try
    {
      await interaction.editReply({
        content:"Ecco a te la lista dei meme del server! 😂\n\n"+result
      })
    }
    catch(error)
    {
      console.log(error);
    }
  },
  async getMemeByWord(interaction,guild,information)
  {
    const { options } = interaction;
    const searchTerm = options.getString('meme');
    const meme = await memeService.getMemeByText(guild.id,searchTerm);
    try
    {
      if(meme==undefined)
      {
        await interaction.reply({
          content:"Nessun meme contenente quella parola! "+utils.getRandomEmojiFelici(),
          ephemeral:true
        })
      }
      else
      {
        await interaction.reply({
          content:meme+" 😂",
          ephemeral:false
        })
      }
    }
    catch(error)
    {
      console.log(error);
    }
  },
  async validaImmagine(interaction,guild,information)
  {
    if(!information.isUtente)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
      return;
    }
    const isTheMiracleServer = guild.id===process.env.GUILD_ID_TM;
    if(!isTheMiracleServer)
    {
      await interaction.reply({content:"Non sei su TMZ! 😡", ephemeral:true});
      return;
    }
    await interaction.reply({content:"Attualmente non implementato!", ephemeral:true});
    return;

    await interaction.deferReply({ ephemeral: true }); 
      

      let images=await contestService.getImages();
      const immagini = images.filter((x, index, self) => {
        return index === self.findIndex((y) => y.nameGuild === x.nameGuild);
      });

      if(images==undefined || images.length==0)
      {
        interaction.editReply({
          content:"Non ci sono immagini da validare! "+ utils.getRandomEmojiRisposta(),
          ephemeral:true
        });
        return;
      }
      const reply=await interaction.editReply({
        content: 'Scegli un server! '+ utils.getRandomEmojiFelici(),
        components: [generics.creaLookupSenzaEmoji({list:immagini,id:'prova',placeholder:'Servers'})],
        ephemeral: true
      });

      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect, 
      });

      collector.on("collect", async (collected) => {
        var serverSceltoValue = collected.values[0];

        const serverName = images.filter(x=> x.id==serverSceltoValue)[0].nameGuild;
        const servers = images.filter(x=> x.nameGuild==serverName);
        
        interaction.deleteReply();
        var text="Queste sono le immagini da validare del server "+servers[0].guildName+"! "+await utils.getRandomEmojiFelici();
        if(servers.length>1)
          text="Ecco a te le immagini da validare. **Ci sono ancora "+(servers.length-1)+" cacce da validare del server "+servers[0].nameGuild+"!** "+utils.getRandomEmojiFelici();
        immagini[0].images.forEach(element => {
          text+="\n "+element;
        });

        const buttons = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel('Convalida')
                  .setCustomId("button-valida"+"-"+immagini[0].id)
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setLabel("Rigetta")
                  .setCustomId("button-rifiutavalidazione"+"-"+immagini[0].id)
                  .setStyle(ButtonStyle.Danger)
              );

        const message= await interaction.followUp({
          content:text,
          components:[buttons],
          fetchReply:true,
          ephemeral:true
        });
      });

  },
  async getLeaderBoard(interaction,guild,information)
  {
    if(!information.isUtente)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
      return;
    }
    await interaction.reply({content:"Funzione non ancora implementata!", ephemeral:true});
    return;
  },
  async insertOrUpdateSkills(interaction,guild,information)
  {
    if(!information.isUtente)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
      return;
    }
    
    var skills = new Array();
    skills=await skillsService.getAllSkills();
    const reply=await interaction.reply({
      content: 'Scegli la skills che vuoi aggiungere! '+ utils.getRandomEmojiFelici(),
      components: [generics.creaLookupSkills(skills,"insertSkills",'Scegli una skills')],
      ephemeral: true
    });
    

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect, 
    });

    collector.on("collect", async (collected) => {
      const splittedArray = collected.values[0].split('-');
      await interaction.deleteReply();
        const button = generics.creaButton(ButtonStyle.Primary,"Avanti","buttonSkill-"+splittedArray[0]+"-"+splittedArray[1]);
        const message= await interaction.followUp({
          content:"Procedi all'inserimento o alla modifica della skill! "+utils.getRandomEmojiFelici(),
          ephemeral:true,
          components:[button]
        });
    });

  },
  async showAllSkills(interaction,guild,information)
  {
    const skills = await skillsService.getAllSkillsGuild(guild.id);
    await interaction.deferReply({ ephemeral: true });

    if(skills.length==0)
    {
      try
      {
        await interaction.editReply({
          content:"Questo server non ha skills registrate! "+utils.getRandomEmojiFelici()+"\n\n"
        })
      }
      catch(error)
      {
        console.log(error);
      }
      return;
    }

    let gruppiPerNome = {};
    skills.forEach(obj => {
      if (!gruppiPerNome[obj.name]) {
        gruppiPerNome[obj.name] = [obj];
      } else {
        gruppiPerNome[obj.name].push(obj);
      }
    });
    
    let arrayDiArray = Object.values(gruppiPerNome);
    var i = 0;
    var embeds = [];
    
    arrayDiArray.forEach(array => {
      var nameSkill = array[0].name;
      var emoji = utils.getEmojiLavorativeByName(nameSkill);
      nameSkill+=" "+emoji;

      var list = ""; 
    
      array.forEach(obj => {
        if(parseInt(obj.min)<parseInt(obj.max))
          list += obj.author + ": " + obj.min + " -> " + obj.max + " \n";
        else
          list += obj.author + ": " + obj.min + " \n";
      });
    
      embeds.push({
        name: nameSkill + ":\n" + list + "\n",
        value: "    ",
      });
      i++;
    });
    
    const result = embeds.map(x => x.name).toString().replace(/,/g, "");
    try
    {
      await interaction.editReply({
        content:"Ecco a te la lista delle skills di gilda! "+utils.getRandomEmojiFelici()+"\n\n"+result
      })
    }
    catch(error)
    {
      console.log(error);
    }
  },
  async showMySkills(interaction,guild,information)
  {
    const skills = await skillsService.getSkillsAuthor(guild.id, interaction.user.id);
    await interaction.deferReply({ ephemeral: true });

    if(skills.length==0)
    {
      try
      {
        await interaction.editReply({
          content:"Non hai registrato nessuna skill! "+utils.getRandomEmojiFelici()+"\n\n"
        })
      }
      catch(error)
      {
        console.log(error);
      }
      return;
    }

    var embeds = [];
    skills.forEach(obj=>{
      var emoji=utils.getEmojiLavorativeByName(obj.name);
      if(parseInt(obj.min)<parseInt(obj.max))
      {
        embeds.push({
          name: obj.name +" "+emoji+": " + + obj.min + " -> " + obj.max + " \n\n",
          value: "    ",
        });
      }
      else
      {
        embeds.push({
          name: obj.name +" "+emoji+": " + + obj.min+" \n\n",
          value: "    ",
        });
      }
    });

    const result = embeds.map(x => x.name).toString().replace(/,/g, "");
    try
    {
      await interaction.editReply({
        content:"La tua lista delle skills! "+utils.getRandomEmojiFelici()+"\n\n"+result
      })
    }
    catch(error)
    {
      console.log(error);
    }
  }
}

