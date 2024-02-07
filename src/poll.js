const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType} = require('discord.js');
const setEmoji = require('./autoSetEmoji.js'); 
const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
const modals = require('./modals.js'); 
const generics = require('./generics.js'); 
const utils = require('./utils.js'); 
const dungeonsFirebase = require('./firestore/dungeon.js')
const ruoloTipoRuoloService = require("./firestore/ruoloTipoRuolo.js")


module.exports = {
    async executePollsEvents(interaction, guild,information)
    {
      if(!interaction.isChatInputCommand()) return;
      
      switch(interaction.commandName)
      {
        case "sondaggio-generico": await this.sondaggoEventoDate(interaction,information); break;
        case "sondaggio-si-no": await this.sondaggioSiNo(interaction,information,guild); break;
        case "sondaggio-caccia": await this.sondaggioCaccia(interaction,guild,information); break;
      }
      return;
    },
    async sondaggioData(interaction, information)
    {
      if(!information.isUtente)
      {
        await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
        return;
      }

      await interaction.showModal(modals.sondaggioData(interaction.id));

      const submitted = await interaction.awaitModalSubmit({
        filter: async (i) => {
            const filter =
                i.user.id === interaction.user.id &&
                i.customId === `sondaggioGenerico-${interaction.id}`;
            return filter;
        },
        time: 100000,
      }).catch(async x=>{
            await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
            return;
      });
      if(submitted===undefined)
        return;
    
        const fields = submitted.fields;
        const data=fields.getTextInputValue("data");
        var mete=fields.getTextInputValue("mete").replace('\n','').replace(emojiRegex).split('-').filter(x=> x!=='');
    
        const emojis=fields.getTextInputValue("mete").match(emojiRegex);
        var filteredEmojis= emojis == null ? new Array() : emojis;
        if(filteredEmojis.length!==0)
        {
          if(filteredEmojis.length>mete.length || filteredEmojis.length<mete.length)
          {
            if(submitted)
            {
              await submitted.reply({
                content:"Rispetta il formato descritto nella modale",
                ephemeral:true
              });
              return;
            }
          }
        }
    
    
        let embedFields = [];
        for(let i=0;i<mete.length;i++)
        {
          if(filteredEmojis[i]==undefined) filteredEmojis[i] = setEmoji.setEmoji(i);
          const text=(filteredEmojis[i]+" "+mete[i]).replace('undefined','');
          embedFields.push({name:text,value:'     ' });
        }
    
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("Evento il giorno: "+data)
        .setAuthor({ name: interaction.member.nickname, iconURL:"https://i.postimg.cc/L6CGnvzk/hacker-1.png"})
        .setThumbnail('https://i.postimg.cc/vZFpdDMf/logo-removebg-preview.png')
        .addFields(
          embedFields
        )
        .setTimestamp()
        .setFooter({ text: 'RotinielToolsDev' });
    
    
        if (submitted) {
            const message=await submitted.reply({
              content:"@everyone",
              embeds:[exampleEmbed],
              fetchReply:true,
              allowedMentions:{parse:["everyone"]}
            });
            filteredEmojis.forEach(x=> message.react(x))
        }
    },
    async sondaggoEventoDate(interaction, information)
    {
      if(!information.isUtente)
      {
        await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
        return;
      }

      await interaction.showModal(modals.sondaggioEventoDate(interaction.id));

      const submitted = await interaction.awaitModalSubmit({
        filter: async (i) => {
            const filter =
                i.user.id === interaction.user.id &&
                i.customId === `sondaggioEventoDate-${interaction.id}`;
            return filter;
        },
        time: 100000,
      }).catch(async x=>{
            await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
            return;
      });
      if(submitted===undefined)
        return;
    
        const fields = submitted.fields;
        const data=fields.getTextInputValue("meta");
        var mete=fields.getTextInputValue("date").replace('\n','').replace(emojiRegex).split('-').filter(x=> x!=='');
    
        const emojis=fields.getTextInputValue("date").match(emojiRegex);
        var filteredEmojis= emojis == null ? new Array() : emojis;
        // if(filteredEmojis.length!==0)
        // {
        //   if(filteredEmojis.length>mete.length || filteredEmojis.length<mete.length)
        //   {
        //     if(submitted)
        //     {
        //       await submitted.reply({
        //         content:"Rispetta il formato descritto nella modale",
        //         ephemeral:true
        //       });
        //       return;
        //     }
        //   }
        // }
    
    
        let embedFields = [];
        for(let i=0;i<mete.length;i++)
        {
          if(filteredEmojis[i]==undefined) filteredEmojis[i] = setEmoji.setEmoji(i);
          const text=(filteredEmojis[i]+" "+mete[i]).replace('undefined','');
          embedFields.push({name:text,value:'     ' });
        }
    
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("Evento: "+data)
        .setAuthor({ name: interaction.member.nickname, iconURL:"https://i.postimg.cc/L6CGnvzk/hacker-1.png"})
        .setThumbnail('https://i.postimg.cc/vZFpdDMf/logo-removebg-preview.png')
        .addFields(
          embedFields
        )
        .setTimestamp()
        .setFooter({ text: 'RotinielToolsDev' });
    
    
        if (submitted) {
            const message=await submitted.reply({
              content:"@everyone",
              embeds:[exampleEmbed],
              fetchReply:true,
              allowedMentions:{parse:["everyone"]}
            });
            filteredEmojis.forEach(x=> message.react(x))
        }
    },
    async sondaggioSiNo(interaction,information,guild)
    {
      if(!information.isUtente)
      {
        await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
        return;
      }

      await interaction.showModal(modals.sondaggioSiNo(interaction.id));
      const submitted = await interaction.awaitModalSubmit({
        filter: async (i) => {
            const filter =
                i.user.id === interaction.user.id &&
                i.customId === `sondaggioSiNo-${interaction.id}`;
            return filter;
        },
        time: 60000,
      }).catch(async x=>{
            await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
            return;
      });
      if(submitted===undefined)
        return;

      const pollQuestion = submitted.fields.getTextInputValue("question");
      const exampleEmbed = new EmbedBuilder()
            .setColor(0xf9de35)
            .setDescription("**"+pollQuestion+"**")
            .setAuthor({ name: interaction.member.nickname, iconURL:"https://i.postimg.cc/L6CGnvzk/hacker-1.png"})
            .setThumbnail('https://i.postimg.cc/vZFpdDMf/logo-removebg-preview.png')
            .addFields(
              {name: "Si", value:"0",inline:true},
              {name: "No", value:"0",inline:true}
            )
            .setTimestamp()
            .setFooter({ text: 'RotinielToolsDev' });
      
      const reply=await submitted.reply(
        {
          content:"@everyone",
          embeds:[exampleEmbed],
          fetchReply:true,
          allowedMentions:{parse:["everyone"]}
        }
        );

      var id= utils.idRnd();
      var poll = {idGuild:guild.id, list: [], date: utils.getData(), author: interaction.member.nickname, title:pollQuestion, id:id};

      utils.responseSondaggioSiNo.push(poll);

      const pollButtons = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setLabel('Si')
            .setCustomId('poll-si-'+id)
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setLabel('No')
            .setCustomId('poll-no-'+id)
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setLabel('Mostra dettaglio')
            .setCustomId('poll-utenti-'+id)
            .setStyle(ButtonStyle.Primary)
        );
      if(submitted)
        submitted.editReply({components:[pollButtons]});
    },
    async sondaggioCaccia(interaction,guild,information)
    {
      if(!information.isUtente)
      {
        await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
        return;
      }

      var dungeons = new Array();
      dungeons=await dungeonsFirebase.getDungeonDocuments();
      const reply=await interaction.reply({
        content: 'Cominciamo! Scegli il dungeon in cui andrete a caccia! '+ utils.getRandomEmojiFelici(),
        components: [generics.creaLookup(dungeons,'dungeonsId','Scegli un dungeon')],
        ephemeral: true
      });

      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect, 
      });
      var dungeonScelto;
      collector.on("collect", async (collected) => {
      dungeonScelto = collected.values[0];
      await interaction.deleteReply();

        const emoji=dungeons.filter(x=> x.name==dungeonScelto)[0].emoji;
        const randomEmoji = utils.getRandomEmoji();
        var text="**Questa sera caccia a "+dungeonScelto+" vota: "+emoji+" se __ci sei__, "+randomEmoji+" se __non ci sei__**.";
        const message= await interaction.followUp({
          content:"@everyone",
          embeds:[generics.creaEmbeded("Caccia a "+dungeonScelto+".",text,interaction)],
          fetchReply:true,
          allowedMentions:{parse:["everyone"]}
        });
        message.react(emoji);
        message.react(randomEmoji);

        await dungeonsFirebase.insertCacciaOrganizzata({author:information.author,destination:dungeonScelto, guild:guild,idMessage:message.id,idChannel:interaction.channelId});
      });
    }
}