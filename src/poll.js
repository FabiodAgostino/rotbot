const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType} = require('discord.js');
const setEmoji = require('./autoSetEmoji.js'); 
const emojiRegex = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
const modals = require('./modals.js'); 
const generics = require('./generics.js'); 
const fireBase = require('./firestore/dungeon.js'); 
const utils = require('./utils.js'); 



module.exports = {
    async executePollsEvents(interaction)
    {
      if(!interaction.isChatInputCommand()) return;
      
      switch(interaction.commandName)
      {
        case "sondaggio-data": await this.sondaggioData(interaction); break;
        case "sondaggio-si-no": await this.sondaggioSiNo(interaction); break;
        case "sondaggio-caccia": await this.sondaggioCaccia(interaction); break;

      }
      return;
    },
    async sondaggioData(interaction)
    {
      interaction.showModal(modals.sondaggioData());

      const submitted = await interaction.awaitModalSubmit({
          time: 60000,
          filter: i => i.user.id === interaction.user.id,
        }).catch(error => {
          console.error(error)
          return null
        })
    
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
          embedFields.push({name:text,value:'---------' });
        }
    
        const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle("Evento il giorno: "+data)
        .setDescription("@everyone")
        .setAuthor({ name: interaction.user.globalName, iconURL:"https://static-00.iconduck.com/assets.00/avatar-icon-256x256-1r8gwgdd.png"})
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Anchor_pictogram_yellow.svg/845px-Anchor_pictogram_yellow.svg.png')
        .addFields(
          embedFields
        )
        .setTimestamp()
        .setFooter({ text: 'RotinielToolsDev' });
    
    
        if (submitted) {
            const message=await submitted.reply({
              embeds:[exampleEmbed],
              fetchReply:true
            });
            filteredEmojis.forEach(x=> message.react(x))
        }
    },

    async sondaggioSiNo(interaction)
    {
      interaction.showModal(modals.sondaggioSiNo());

      const submitted = await interaction.awaitModalSubmit({
        time: 60000,
        filter: i => i.user.id === interaction.user.id,
      }).catch(error => {
        console.error(error)
        return null
      })

      const pollQuestion = submitted.fields.getTextInputValue("question");
      const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setDescription("**"+pollQuestion+"**"+"@everyone")
            .setAuthor({ name: interaction.user.globalName, iconURL:"https://static-00.iconduck.com/assets.00/avatar-icon-256x256-1r8gwgdd.png"})
            .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Anchor_pictogram_yellow.svg/845px-Anchor_pictogram_yellow.svg.png')
            .addFields(
              {name: "Si", value:"0",inline:true},
              {name: "No", value:"0",inline:true}
            )
            .setTimestamp()
            .setFooter({ text: 'RotinielToolsDev' });
      
        const reply=await submitted.reply({embeds:[exampleEmbed],fetchReply:true});

            const pollButtons = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel('Si')
                  .setCustomId('poll-si-'+reply.id)
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setLabel('No')
                  .setCustomId('poll-no-'+reply.id)
                  .setStyle(ButtonStyle.Danger)
              );
      if(submitted)
        submitted.editReply({components:[pollButtons]});
    },

    async sondaggioCaccia(interaction)
    {
      var dungeons = new Array();
      dungeons=await fireBase.getAllDungeon();
      const reply=await interaction.reply({
        content: 'Cominciamo! Scegli il dungeon in cui andrete a caccia.',
        components: [generics.creaLookup(dungeons,'dungeonsId','Scegli un dungeon')],
        ephemeral: true
      });
      var dungeons = new Array();
      dungeons=await fireBase.getAllDungeon();
      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.StringSelect, 
      });
      var dungeonScelto;
      collector.on("collect", async (collected) => {
        dungeonScelto = collected.values[0];
        interaction.deleteReply();

        const emoji=dungeons.filter(x=> x.name==dungeonScelto)[0].emoji;
        const randomEmoji = utils.getRandomEmoji();
        var text="**Questa sera caccia a "+dungeonScelto+" vota: "+emoji+" se __ci sei__, "+randomEmoji+" se __non ci sei__**.";
        const message= await interaction.followUp({
          embeds:[generics.creaEmbeded("Caccia",text,interaction)],
          fetchReply:true
        });
        message.react(emoji);
        message.react(randomEmoji);
        await fireBase.insertCacciaOrganizzata({author:interaction.member.nickname,destination:dungeonScelto});
      });
    }
}