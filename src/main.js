require('dotenv').config({path:"../.env"});
const { Client, GatewayIntentBits,Events } = require('discord.js');

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
const fireBaseConnect = require('./firestore/firebaseConnect.js'); 
const serverDiscordService = require('./firestore/serverDiscord.js'); 




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

client.on(Events.GuildCreate, async (guild) => {
  const server =await serverDiscordService.getServer(guild.id);
  if(server==undefined || server.length==0)
  {
    await serverDiscordService.insertServer({idGuild:guild.id, name:guild.name});
    console.log(`Il bot è stato aggiunto al db. ${guild.name}`);
  }
  else
    console.log(`Il bot è gia presente nel db. ${guild.name}`);

});




client.login(process.env.TOKEN);

