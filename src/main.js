require('dotenv').config({path:"../.env"});
const { Client, GatewayIntentBits,Events } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    ],
});
const polls = require('./poll.js'); 
const eventButtons = require('./eventButtons.js'); 
const eventCommands = require('./eventCommands.js'); 
const eventGenericsCommands = require('./genericsCommands.js'); 
const eventMessages = require('./eventMessages.js'); 
const fireBaseConnect = require('./firestore/firebaseConnect.js'); 
const ruoloTipoRuoloService = require('./firestore/ruoloTipoRuolo.js'); 
const eventGuildMemberUpdate = require('./eventGuildMemberUpdate.js'); 

const utils = require('./utils.js'); 




client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  await fireBaseConnect.connectFirebase();
});

client.on(Events.InteractionCreate,async (interaction) =>{
  const guildName =client.guilds.cache.filter(x=> interaction.guildId ==x.id).first().name;
  const guild= {name:guildName, id:interaction.guildId};
  const information = await ruoloTipoRuoloService.getGuardInformation(interaction,guild);

  console.log("\nLogger: guild.name:"+guild.name+" | username:"+interaction.user?.username+" | userGlobal:"+interaction.user?.globalName+" | Orario:"+ utils.getHours(utils.getDateUTF1())+ " | "+interaction.commandName 
  +" | isAdmin: "+information.isAdmin +" | isUtente: "+information.isUtente +"\n");

  await eventCommands.executeCommandsEvent(interaction,guild,information);
  await polls.executePollsEvents(interaction,guild,information);
  await eventButtons.executeButtonsEvents(interaction,guild,client,information);
})

client.on(Events.MessageCreate,async (message) =>{
  
  eventMessages.executeMessageEvent(message);
})

client.on(Events.GuildCreate, async (guild) => {
  await eventGenericsCommands.executeGenericsEvent(guild,client);
});


client.on(Events.GuildMemberAdd, (member) => {
});


client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  const guildId = newMember.guild.id;
  try
  {
    await eventGuildMemberUpdate.sendInstuction(guildId,newMember,oldMember);
    console.log("sendInstuction OK");
  }
  catch(exception)
  {
    console.log("sendInstuction KO");
    return;
  }
});

client.login(process.env.TOKEN);

