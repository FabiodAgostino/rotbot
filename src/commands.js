require('dotenv').config({path:"../.env"});
const utils = require('./utils.js');
const {REST, Routes, ApplicationCommandOptionType} = require("discord.js")

const commands= [
    {
      name: 'sondaggio-data',
      description: 'Crea un sondaggio multi opzione per una data '
    },
    {
      name: 'sondaggio-evento-date',
      description: 'Crea un sondaggio singola opzione per molte date'
    },
    {
      name: 'insert-meme',
      description: 'Salva i tuoi meme per non dimenticarli ❤️',
      required:true,
      options:
      [
        {name:"meme", description:"Il testo del meme", requred:true, type:ApplicationCommandOptionType.String},
      ]
    },
    {
      name: 'show-all-meme',
      description: 'Mostra tutti i meme'
    },
    {
      name: 'get-random-meme',
      description: 'Torna un meme casuale'
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
          Object.values(utils.dungeons).sort((a, b) => a.name.localeCompare(b.name)).map(item => ({
            name: item.emoji+" "+item.name,
            value: item.value,
          }))
        }
      ]
    },
    {
      name:'set-classe',
      description:'Permette di settare classi inserendo il role specifico discord',
      options:
      [
        {
          name:"ruolo",
          description:"Il ruolo da mappare",
          required:true,
          type: ApplicationCommandOptionType.Role
        },
        {name:"classe", description:"La classe da accoppiare", requred:true, type:ApplicationCommandOptionType.String},
      ]
    },
    {
      name:'set-type-user',
      description:'Permette di registrare la tipologia di ruolo in modo che possa accedere a determinati comandi.',
      options:
      [
        {
          name:"ruolo",
          description:"Il ruolo da mappare",
          required:true,
          type: ApplicationCommandOptionType.Role
        },
        {
          name:"tipologia-ruolo",
          description:"Admin: accedono a qualunque funzione. Utente: accede alle funzioni base (poll)",
          required:true,
          type: ApplicationCommandOptionType.String,
          choices:
          [
            {name:"Admin",value:"admin"},
            {name:"Utente",value:"utente"}
          ]
        }
      ]
    },
    {
      name:'get-version',
      description:'Ritorna la versione del bot.'
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





