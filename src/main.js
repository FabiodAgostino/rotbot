require('dotenv').config({path:"../.env"});
const { Client, GatewayIntentBits,
  Events,ComponentType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent
  ],
});
const polls = require('./poll.js'); 
const eventButtons = require('./eventButtons.js'); 
const fireBase = require('./firestore/dungeon.js'); 
const utils = require('./utils.js'); 





client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await fireBase.connectFirebase();
});

client.on(Events.InteractionCreate,async (interaction) =>{
  if(interaction.commandName==="start-caccia")
  {
    const channel = interaction.channel;
    if (channel) {
      const messages = await channel.messages.fetch({ limit: 100 }); // Limita il numero di messaggi da cercare se necessario

      // Cerca l'embed in tutti i messaggi nel canale
      var nowDate = utils.convertDateToDateNormal(new Date());
      var embedArray= new Array(100);
      const embeds = messages.map(x=> x.embeds);
      // .forEach(y=> embedArray=y.filter(z=> utils.convertTimeStampToDate(z.timestamp)===nowDate));
      console.log(embeds.map(embed => embed.filter(embedArray => embedArray && embedArray.length > 0)[0].data))

      const targetEmbed = messages.find((msg) => {
        return msg.embeds.length > 0 && msg.embeds[0].title === "Caccia";
      });
      if (targetEmbed) {
        await interaction.reply(`Embed trovato: ${targetEmbed.embeds[0].title}`);
      } else {
        await interaction.reply('Embed non trovato.');
      }
    } else {
      await interaction.reply('Canale non trovato.');
    }
  }
  polls.executePollsEvents(interaction);
  eventButtons.executeButtonsEvents(interaction);
})



client.login(process.env.TOKEN);

