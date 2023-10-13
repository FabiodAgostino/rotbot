require('dotenv').config({path:"../.env"});
const { Client, GatewayIntentBits,
  Events,ComponentType, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
});
const polls = require('./poll.js'); 
const eventButtons = require('./eventButtons.js'); 
const eventCommands = require('./eventCommands.js'); 
const messageCommands = require('./eventMessages.js'); 


const fireBaseConnect = require('./firestore/firebaseConnect.js'); 

const utils = require('./utils.js'); 
const generics = require('./generics.js'); 




client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await fireBaseConnect.connectFirebase();
});

client.on(Events.InteractionCreate,async (interaction) =>{4
  const guildName =client.guilds.cache.filter(x=> interaction.guildId ==x.id).first().name;
  const guild= {name:guildName, id:interaction.guildId};


  eventCommands.executeCommandsEvent(interaction,guild);
  polls.executePollsEvents(interaction,guild);
  eventButtons.executeButtonsEvents(interaction,guild,client);
})

client.on(Events.MessageCreate,async (message) =>{
  const GuildMessages =client.guilds.cache.filter(x=> message.guildId ==x.id).first();
  const guild= {name:GuildMessages.name, id:GuildMessages.id};
  
  messageCommands.executeCommandsEvent(message,guild);
});




client.login(process.env.TOKEN);

