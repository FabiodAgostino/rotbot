require('dotenv').config({path:"../.env"});
const utils = require('./utils.js');
const {REST, Routes, ApplicationCommandOptionType} = require("discord.js")

const commands= [
    {
      name: 'sondaggio-generico',
      description: 'Crea un sondaggio generico'
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
      name: 'get-meme-by-word',
      description: 'Ritorna un meme con il testo più simile',
      required:true,
      options:
      [
        {name:"meme", description:"Il testo del meme che vuoi cercare", requred:true, type:ApplicationCommandOptionType.String},
      ]
    },
    {
      name: 'insert-segnalazione',
      description: 'Insersci un ticket di assistenza oppure consigliaci qualche nuova feature!',
      voiceChannel: false,
      options: [
      {
          name: 'tipologa',
          description: 'Seleziona una tipologia di ticket',
          type: ApplicationCommandOptionType.String,
          required: true,
          choices: [
              {
                  name: "Malfunzionamento",
                  value: "Malfunzionamento"
              },
              {
                  name: "Correzione dati Tool",
                  value: "Correzione dati tool",
              },
              {
                name: "Consigli",
                value: "Consigli",
            }
          ]
      },
      {name:"testo", description:"Il testo del ticket", requred:true, type:ApplicationCommandOptionType.String},
      ],
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
      name: 'valida-immagini',
      description: "Permette di validare un'immagine da un validatore"
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
      name:"get-leaderboard",
      description:"Ritorna la leaderboard dello speed-run contest",
      options:
      [
        {
          name:'scegli-dungeon',
          description:'Scegli il dungeon',
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
      name:'set-validatore',
      description:'Permette di mappare il role "Validatore" con un utente specifico.',
      options:
      [
        {
          name:"validatore",
          description:"L'utente che vuoi rendere validatore",
          required:true,
          type: ApplicationCommandOptionType.Mentionable
        }
      ]
    },
    {
      name:'get-version',
      description:'Ritorna la versione del bot.'
    },
    {
      name:"insert-caccia-manuale",
      description:"Inserisci una caccia manualmente a sistema",
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
      name: 'insert-update-skills',
      description: 'Permette di inserire o modificare punteggi skills lavorative o di supporto sul server'
    },
    {
      name: 'show-skills-guild',
      description: 'Permette di visualizzare le skills degli utenti del server',
      options:
      [
        {
          name:"user",
          description:"L'utente di cui vuoi vedere le skills",
          required:false,
          type: ApplicationCommandOptionType.Mentionable
        }
      ]
    },
    {
      name: 'show-my-skills',
      description: 'Mostra le tue skills',
    },
    {
      name:"show-utenti-by-skill",
      description:"Mostra gli utenti che possiedono una specifica lavorativa con il dettaglio del valore della skill",
      options:
      [
        {
          name:'scegli-lavorativa',
          description:'Scegli la lavorativa',
          type: ApplicationCommandOptionType.Number,
          required:true,
          choices:
          Object.values(utils.emojiLavorative).sort((a, b) => a.name.localeCompare(b.name)).map(item => ({
            name: item.emoji+" "+item.name,
            value: item.value,
          }))
        }
      ]
    },
    {
      name: 'insert-update-vendor',
      description: 'Permette di inserire o modificare nome e categorie vendor',
    },
    {
      name: 'show-vendor-guild',
      description: 'Permette di visualizzare i vendor degli utenti del server',
      options:
      [
        {
          name:"user",
          description:"L'utente di cui vuoi vedere il vendor",
          required:false,
          type: ApplicationCommandOptionType.Mentionable
        }
      ]
    },
    {
      name: 'show-my-vendor',
      description: 'Mostra il tuo vendor',
    },
    {
      name:"show-vendor-by-categoria",
      description:"Mostra i vendor che vendono una specifica categoria con il nome utente del proprietario del vendor",
      options:
      [
        {
          name:'scegli-categoria',
          description:'Scegli la categoria',
          type: ApplicationCommandOptionType.Number,
          required:true,
          choices:
          Object.values(utils.categorieVendor).sort((a, b) => a.name.localeCompare(b.name)).map(item => ({
            name: item.emoji+" "+item.name,
            value: item.value,
          }))
        }
      ]
    },
    {
      name: 'show-all-commands',
      description: 'Mostra tutti i comandi del server',
    },
  ];

  const rest = new REST({version:'10'}).setToken(process.env.TOKEN);

  async function setCommands(guildId)
  {
    try{
      console.log("Inizio registrazione commands per guildId: "+guildId);
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),{body: commands}
      )
      console.log("Slash commands registrati per server "+guildId);
    }catch(error)
    {
      console.log("Errore:"+ error +" per server "+guildId);
    }
  }
  function showAllCommands()
  {
    var text ="";
    commands.forEach(command=>{
      text+="* /"+command.name+" "+command.description+"\n";
    })
    return text;
  }
    

module.exports = {setCommands,showAllCommands}





