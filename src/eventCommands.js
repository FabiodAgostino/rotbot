require('dotenv').config({path:"../.env"});
const cacceOrganizzate = require('./firestore/cacceOrganizzate.js'); 
const ruoloTipoRuoloService = require('./firestore/ruoloTipoRuolo.js'); 
const ruoloTipoClasseService = require('./firestore/ruoloTipoClasse.js'); 
const skillsService = require('./firestore/skills.js'); 
const vendorService = require('./firestore/utenteVendor.js'); 
const contestService = require('./firestore/contest.js'); 
const memeService = require('./firestore/meme.js'); 
const utils = require('./utils.js'); 
const modals = require('./modals.js'); 
const generics = require('./generics.js'); 
const commandsService = require('./commands.js'); 


const { ButtonStyle,ComponentType,ActionRowBuilder,ButtonBuilder  } = require('discord.js');
const { splitMessage } = require('discord.js');

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
        case "show-utenti-by-skill": await this.showUtentiByLavorativa(interaction,guild,information); break;
        case "get-meme-by-word": await this.getMemeByWord(interaction,guild,information); break;
        case "get-leaderboard": await this.getLeaderBoard(interaction,guild,information); break;
        case "insert-update-skills": await this.insertOrUpdateSkills(interaction,guild,information); break;
        case "insert-update-vendor": await this.insertOrUpdateVendor(interaction,guild,information); break;
        case "show-vendor-guild": await this.showAllVendor(interaction,guild,information); break;
        case "show-my-vendor": await this.showMyVendor(interaction,guild,information); break;
        case "show-vendor-by-categoria": await this.showVendorByCategoria(interaction,guild,information); break;
        case "get-random-meme": await interaction.reply({content:await memeService.getRandomMeme(guild.id)+" "+ utils.getRandomEmojiRisposta()}); break;
        case "get-version": interaction.reply({content:"ROTBOT VERSION: __"+utils.VERSION+"__ ⭐", ephemeral:true});break;
        case "show-all-commands": interaction.reply({content:commandsService.showAllCommands(), ephemeral:true});break;

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

    const { options } = interaction;
    const user = options.getUser('user');

    if(user!=undefined)
    {
      var username = user.globalName == undefined ? user.username : user.globalName;
      await this.showMySkills(interaction,guild,information,user.id, username);
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
        name: "**"+nameSkill + "**:\n" + list + "\n",
        value: "    ",
      });
      i++;
    });
    
    const result = embeds.map(x => x.name).toString().replace(/,/g, "");
    try
    {
      await splitMessageAndSend(interaction, "Ecco a te la lista delle skills di gilda! "+utils.getRandomEmojiFelici()+"\n\n"+result);
    }
    catch(error)
    {
      console.log(error);
    }
  },
  async showMySkills(interaction,guild,information,idUser,author)
  {
    userId= idUser!=undefined ? idUser : interaction.user.id;
    const skills = await skillsService.getSkillsAuthor(guild.id, userId);
    await interaction.deferReply({ ephemeral: true });

    if(skills.length==0)
    {
      try
      {
        var message = idUser!= undefined ? author+" non ha alcuna skill registrata! " : "Non hai registrato nessuna skill! ";
        await interaction.editReply({
          content:message+utils.getRandomEmojiFelici()+"\n\n"
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
          name: "**"+obj.name +"** "+emoji+": " + + obj.min + " -> " + obj.max + " \n\n",
          value: "    ",
        });
      }
      else
      {
        embeds.push({
          name: "**"+obj.name +"** "+emoji+": " + + obj.min+" \n\n",
          value: "    ",
        });
      }
    });

    const result = embeds.map(x => x.name).toString().replace(/,/g, "");
    try
    {
      var message = idUser!= undefined ? "Ecco la lista delle skills di **"+author+"**! " : "La tua lista delle skills! ";
      await interaction.editReply({
        content:message+utils.getRandomEmojiFelici()+"\n\n"+result
      })
    }
    catch(error)
    {
      console.log(error);
    }
  },
  async showUtentiByLavorativa(interaction,guild,information)
  {

    const nomeLavorativa = utils.emojiLavorative.filter(x => x.value == interaction.options.get('scegli-lavorativa').value)[0].name;

    if(!nomeLavorativa)
      return;

    const skills = await skillsService.getAuthorsBySkill(guild.id, nomeLavorativa);
    await interaction.deferReply({ ephemeral: true });

    if(skills.length==0)
    {
      try
      {
        await interaction.editReply({
          content:"Questo server non ha utenti con la skill "+nomeLavorativa+" registrata! "+utils.getRandomEmojiFelici()+"\n\n"
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
      if(embeds.length==0)
        embeds.push({name:"Utenti che possiedono la skill **"+nomeLavorativa+emoji+"**\n\n", value:"         "});

      if(parseInt(obj.min)<parseInt(obj.max))
      {
        embeds.push({
          name: "**"+obj.author +"**: " + + obj.min + " -> " + obj.max + " \n",
          value: "    ",
        });
      }
      else
      {
        embeds.push({
          name: "**"+obj.author+"**: " + + obj.min+" \n",
          value: "    ",
        });
      }
    });

    const result = embeds.map(x => x.name).toString().replace(/,/g, "");
    try
    {
      await interaction.editReply({
        content:"\n"+result
      })
    }
    catch(error)
    {
      console.log(error);
    }

  },
  async insertOrUpdateVendor(interaction,guild,information)
  {
    if(!information.isUtente)
    {
      await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
      return;
    }
    
    var categorie = new Array();
    categorie= utils.getCategorieVendor();
    const reply=await interaction.reply({
      content: 'Scegli le categorie che vuoi aggiungere al vendor! '+ utils.getRandomEmojiFelici(),
      components: [generics.creaLookupVendor(categorie,"insertVendor",'Scegli una o più categorie')],
      ephemeral: true
    });
    

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect, 
    });

    collector.on("collect", async (collected) => {
      var nickname = interaction.member.nickname;
      var user = (nickname != undefined && nickname!="") ? nickname : interaction.user.globalName;
      var id=await vendorService.insertOrUpdateVendor({list:collected.values,owner:user,idOwner:interaction.user.id,idGuild:guild.id, name:"temp"})
      var message = utils.isNumber(id) ? "Continua l'inserimento del vendor! " : "Continua la modifica del vendor! ";
      await interaction.deleteReply();
      if(utils.isNumber(id))
        var button = generics.creaButton(ButtonStyle.Primary,"Avanti","buttonVendor-"+id);
      else
        var button = generics.creaButton(ButtonStyle.Success,"Modifica","buttonVendor-"+interaction.user.id+"-u");
        
        await interaction.followUp({
          content:message+utils.getRandomEmojiFelici(),
          ephemeral:true,
          components:[button]
        });
    });

  },
  async showAllVendor(interaction, guild, information)
  {
    const vendors = await vendorService.getAllVendorGuild(guild.id);
    await interaction.deferReply({ ephemeral: true });

    if(vendors.length==0)
    {
      try
      {
        await interaction.editReply({
          content:"Questo server non ha vendor registrati! "+utils.getRandomEmojiFelici()+"\n\n"
        })
      }
      catch(error)
      {
        console.log(error);
      }
      return;
    }

    const { options } = interaction;
    const user = options.getUser('user');

    if(user!=undefined)
    {
      var username = user.globalName == undefined ? user.username : user.globalName;
      await this.showMyVendor(interaction,guild,information,user.id, username);
      return;
    }


    let gruppiPerNome = {};
    vendors.forEach(obj => {
      if (!gruppiPerNome[obj.name]) {
        gruppiPerNome[obj.name] = [obj];
      } else {
        gruppiPerNome[obj.name].push(obj);
      }
    });
    
    let arrayDiArray = Object.values(gruppiPerNome);
    var embeds = [];
    var list = [];
    var listCategory = [];
    arrayDiArray.forEach(array => {
      array.forEach(obj => {
        obj.list = obj.list.sort();
        obj.list.forEach(category=>{
          var cat=utils.categorieVendor.filter(x=> category==x.name)[0];
          listCategory.push("* "+cat.name+" "+cat.emoji+"\n");
        })
        list += "### "+obj.owner + " ("+obj.name+")"+"\n"+"__Merce venduta__:\n"+listCategory;

        embeds.push({
          name: list + "\n",
          value: "    ",
        });
        listCategory=[];
        list=[];
      });
      });
    
     
    
    const result = embeds.map(x => x.name).toString().replace(/,/g, "");
    try
    {
      await interaction.editReply({
        content:"Ecco a te la lista dei vendor di gilda! "+utils.getRandomEmojiFelici()+"\n\n"+result
      })
    }
    catch(error)
    {
      console.log(error);
    }
  },
  async showMyVendor(interaction,guild,information,idOwner,owner)
  {
    ownerId= idOwner!=undefined ? idOwner : interaction.user.id;
    const vendor = await vendorService.getVendorAuthor({idGuild:guild.id, idOwner:ownerId});

    if(vendor==undefined)
    {
      try
      {
        var message = ownerId!= undefined ? owner+" non ha alcun vendor registrato! " : "Non hai registrato nessun vendor! ";
        await interaction.editReply({
          content:message+utils.getRandomEmojiFelici()+"\n\n"
        })
      }
      catch(error)
      {
        console.log(error);
      }
      return;
    }


    
    var embeds = [];
    var list = [];
    var listCategory = [];

    vendor.list.forEach(category=>{
      var cat=utils.categorieVendor.filter(x=> category==x.name)[0];
      listCategory.push("* "+cat.name+" "+cat.emoji+"\n");
    })
    list += "### "+vendor.owner + " ("+vendor.name+")"+"\n"+"__Merce venduta__:\n"+listCategory;

    embeds.push({
      name: list + "\n",
      value: "    ",
    });
    listCategory=[];
    list=[];

    const result = embeds.map(x => x.name).toString().replace(/,/g, "");
    try
    {
      var message = idOwner!= undefined ? "Ecco a te il vendor di **"+owner+"**! " : "Ecco il tuo vendor! ";
      await splitMessageAndSend(interaction, message+utils.getRandomEmojiFelici()+"\n\n"+result,true);
      // await interaction.editReply({
      //   content:message+utils.getRandomEmojiFelici()+"\n\n"+result
      // })
    }
    catch(error)
    {
      console.log(error);
    }
  },
  async showVendorByCategoria(interaction,guild,information)
  {
    const nomeCategoria = utils.categorieVendor.filter(x => x.value == interaction.options.get('scegli-categoria').value)[0].name;

    if(!nomeCategoria)
      return;

    const vendors = await vendorService.getVendorByCategoria(guild.id, nomeCategoria);
    await interaction.deferReply({ ephemeral: true });

    if(vendors.length==0)
    {
      try
      {
        await interaction.editReply({
          content:"Questo server non ha vendor con la categoria "+nomeCategoria+" registrata! "+utils.getRandomEmojiFelici()+"\n\n"
        })
      }
      catch(error)
      {
        console.log(error);
      }
      return;
    }

    let gruppiPerNome = {};
    vendors.forEach(obj => {
      if (!gruppiPerNome[obj.name]) {
        gruppiPerNome[obj.name] = [obj];
      } else {
        gruppiPerNome[obj.name].push(obj);
      }
    });
    
    let arrayDiArray = Object.values(gruppiPerNome);
    var embeds = [];
    var list = [];
    var listCategory = [];
    arrayDiArray.forEach(array => {
      array.forEach(obj => {
        obj.list = obj.list.sort();
        obj.list.forEach(category=>{
          var cat=utils.categorieVendor.filter(x=> category==x.name)[0];
          if(cat.name!=nomeCategoria)
            listCategory.push("* "+cat.name+" "+cat.emoji+"\n");
          else
            listCategory.push("* **__"+cat.name+"__** "+cat.emoji+"\n");

        })  
        list += "### "+obj.owner + " ("+obj.name+")"+"\n"+"__Merce venduta__:\n"+listCategory;

        embeds.push({
          name: list + "\n",
          value: "    ",
        });
        listCategory=[];
        list=[];
      });
      });
    

    const result = embeds.map(x => x.name).toString().replace(/,/g, "");
    try
    {
      await interaction.editReply({
        content:"\n"+result
      })
    }
    catch(error)
    {
      console.log(error);
    }

  },
}
async function splitMessageAndSend(interaction, content, vendor=false) {
  const maxLength = 1800;
  const messages = [];
  if (interaction.deferred || interaction.replied) {
    // Se l'interazione è già stata differita o è stata inviata una risposta, usa followUp direttamente
    const chunks = content.match(/[\s\S]{1,1800}(\n|$)|.*/g) || [];
    for (const chunk of chunks) {
      messages.push(chunk);
    }
    for (const message of messages) {
      if(message!=="")
      await interaction.followUp(message);
    }
  } else {
    // Altrimenti, differisci la risposta e invia i messaggi successivi
    await interaction.deferReply({ ephemeral: true });

    const chunks = content.match(/[\s\S]{1,1800}(\n|$)|.*/g) || [];
    let currentMessage = '';

    for (const chunk of chunks) {
      if (currentMessage.length + chunk.length <= maxLength) {
        // Se aggiungendo il chunk non superiamo la lunghezza massima, aggiungilo al messaggio corrente
        currentMessage += chunk;
      } else {
        // Aggiungi il messaggio corrente ai messaggi e reinizializza con il chunk attuale
        messages.push(currentMessage);
        currentMessage = chunk;
      }
    }

    // Aggiungi l'ultimo messaggio alla lista
    messages.push(currentMessage);

    // Invia i messaggi successivi
    for (const message of messages) {
      await interaction.followUp({
        content: message,
        ephemeral: true
      });
    }
  }
}

