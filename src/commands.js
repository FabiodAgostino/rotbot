require('dotenv').config({path:"../.env"});
const {REST, Routes, ApplicationCommandOptionType} = require("discord.js")
const dungeons = [
  { name: 'Kur Nughul 2' },
  { name: 'Broccoli' },
  { name: 'Capitale Orchesca TS' },
  { name: 'Isola dei Draghi' },
  { name: 'Minotauri Isola' },
  { name: 'Draconiani' },
  { name: 'Surtur' },
  { name: 'Illitidh' },
  { name: 'Deva' },
  { name: 'Kur Nughul 3' },
  { name: 'Piramide Elfica' },
  { name: 'Piramide di Tremec' },
  { name: 'Kur Nughul 1' },
  { name: 'Kur Nughul 4' },
  { name: 'Gargoyle TS' },
  { name: 'Pirati non morti' },
  { name: 'Damnagoth' },
];

const commands= [
    {
      name: 'sondaggio-data',
      description: 'Crea un sondaggio per una data multiparametro'
    },
    {
      name: 'sondaggio-si-no',
      description: 'Crea un sondaggio con domanda unica e risposta si/no'
    },
    {
      name: 'sondaggio-caccia',
      description: 'Crea un sondaggio per una caccia con la possibilità di salvare i dati sulle tempistiche e sul loot.'
    },
    {
      name:"start-caccia",
      description:"Lancia il comando se vuoi prendere il tempo della tua caccia",
      options:
      [
        {
          name:'scegli-dungeon',
          description:'Scegli il tuo dungeon',
          type: ApplicationCommandOptionType.Number,
          required:true,
          choices:
          Object.values(dungeons).map(item => ({
            name: item.name,
            value: "1", // Puoi usare 'name' come valore se desideri
          }))
        }
      ]
    }
  ];

  const rest = new REST({version:'10'}).setToken(process.env.TOKEN);


  (async () =>{
    try{
      console.log("Inizio registrazione commands");
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),{body: commands}
      )
      console.log("Slash commands registrati");
    }catch(error)
    {
      console.log("Errore:"+ error);
    }
  })();





