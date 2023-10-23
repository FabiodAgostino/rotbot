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
const eventMessages = require('./eventMessages.js'); 
const fireBaseConnect = require('./firestore/firebaseConnect.js'); 
const serverDiscordService = require('./firestore/serverDiscord.js'); 
const commands = require('./commands.js'); 
const utils = require('./utils.js'); 






client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await fireBaseConnect.connectFirebase();
});

client.on(Events.InteractionCreate,async (interaction) =>{
  const guildName =client.guilds.cache.filter(x=> interaction.guildId ==x.id).first().name;
  const guild= {name:guildName, id:interaction.guildId};
  console.log("Logger: guild.name:"+guild.name+" | username:"+interaction.user?.username+" | userGlobal:"+interaction.user?.globalName+" | Orario:"+ utils.getHours(new Date()));

  await eventCommands.executeCommandsEvent(interaction,guild);
  await polls.executePollsEvents(interaction,guild);
  await eventButtons.executeButtonsEvents(interaction,guild,client);
})

client.on(Events.MessageCreate,async (message) =>{
  
  eventMessages.executeMessageEvent(message);
})

client.on(Events.GuildCreate, async (guild) => {
  const server =await serverDiscordService.getServer(guild.id);
  await commands.setCommands(guild.id);
  if(server==undefined || server.length==0)
  {
    await serverDiscordService.insertServer({idGuild:guild.id, name:guild.name});
    console.log(`Il bot è stato aggiunto al db. ${guild.name}`);
  }
  else
    console.log(`Il bot è gia presente nel db. ${guild.name}`);
});




client.login(process.env.TOKEN);

