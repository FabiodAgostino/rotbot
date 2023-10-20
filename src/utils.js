
const dungeons = [
    { name: 'Kur Nughul 2',value:1,emoji:"🧛🏼‍♂️"},
    { name: 'Broccoli',value:2,emoji:"🥦" },
    { name: 'Capitale Orchesca TS',value:3,emoji:"🤢" },
    { name: 'Isola dei Draghi',value:4,emoji:"🐉" },
    { name: 'Minotauri Isola',value:5,emoji:"🐂" },
    { name: 'Draconiani',value:6,emoji:"🐲" },
    { name: 'Surtur',value:7,emoji:"💀" },
    { name: 'Illitidh',value:8,emoji:"👽" },
    { name: 'Deva',value:9,emoji:"🧚‍♂️" },
    { name: 'Kur Nughul 3',value:10,emoji:"😈" },
    { name: 'Piramide Elfica',value:11,emoji:"🐍" },
    { name: 'Piramide di Tremec',value:12,emoji:"🦟" },
    { name: 'Kur Nughul 1',value:13,emoji:"👹" },
    { name: 'Kur Nughul 4',value:14,emoji:"👺" },
    { name: 'Gargoyle TS',value:15,emoji:"👾" },
    { name: 'Pirati non morti',value:16,emoji:"☠️" },
    { name: 'Damnagoth',value:17,emoji:"🧙‍♂️" },
    { name: 'Dinodonti',value:18,emoji:"🦕" },
  ];

const classiTM = 
[
    {name:"Guerriero", type:"Prima linea"},
    {name:"Berserker", type:"Prima linea"},
    {name:"Paladino", type:"Prima linea"},
    {name:"Mago", type:"Mago"},
    {name:"Ranger", type:"Ranger"},
    {name:"Bardo", type:"Bardo"},
    {name:"Chierico", type:"Chierico"},
    {name:"Rogue", type:"Rogue"},
    {name:"Ladro", type:"Rogue"},
    {name:"Druido", type:"Druido"},
]

const emojiSorridenti = [
    "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🥰", "😋", "😎", "😏", "😌", "😛", "😜"
  ];
const emojiFelici = [
    "😀", "😃", "😄", "😁", "😆","😊", "😇", "🥰",
]

module.exports =
{
    dungeons,
    classiTM,
    convertTimeStampToDate(timestamp)
    {
        var data = new Date(timestamp);
        var giorno = data.getDate();
        var mese = data.getMonth() + 1;
        var anno = data.getFullYear();
        return giorno + '/' + mese + '/' + anno;
    }
    ,
    convertDateToDateNormal(date)
    {
        return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
    },
    differenceBetweenTwoTimeStamp(date)
    {
        const specificDate = new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
        const currentTimestamp = new Date();
        const timeDifference = currentTimestamp-specificDate;

        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
        return {hours:hours, minutes:minutes, seconds: seconds};
    },
    trovaDataPiùRecente(arrayDocumenti) {
        return arrayDocumenti.reduce((dataRecente, documento) => {
          const timestamp = documento.date.seconds * 1000 + documento.date.nanoseconds / 1000000;
          const timestampRecente = dataRecente.date.seconds * 1000 + dataRecente.date.nanoseconds / 1000000;
      
          return timestamp > timestampRecente ? documento : dataRecente;
        });
      },
    getRandomEmoji() {
        const randomEmoji = ['🐗','🦢','🐁','🦜','⚔️','🦆','😡','🤬','😵‍💫','🤕','🥺'];
        const indiceCasuale = Math.floor(Math.random() * randomEmoji.length);
        return randomEmoji[indiceCasuale];
      },
    getRandomEmojiFelici() {
    const indiceCasuale = Math.floor(Math.random() * emojiFelici.length);
    return emojiFelici[indiceCasuale];
    },
    getRandomEmojiRisposta()
    {
        const indiceCasuale = Math.floor(Math.random() * emojiSorridenti.length);
        return emojiSorridenti[indiceCasuale];
    },
    async isUtenteOrAdmin(rolesGuild, interaction)
    {
        const rolesUsers=interaction.member.roles.cache.map(x=> x.name);
        const roleAdmin = rolesGuild.filter(x=> x.tipoRuolo==="admin").map(x=> x.role);
        const roleUser = rolesGuild.filter(x=> x.tipoRuolo==="utente").map(x=> x.role);

        if(roleAdmin.some((adminRole) => rolesUsers.includes(adminRole)))
            return "admin";
        if(roleUser.some((userRole) => rolesUsers.includes(userRole)))
            return "utente";
        return null;
    },
    isAdmin(type)
    {
        if(type=="admin")
            return true;
    },
    isUtente(type)
    {
        if(type=="utente")
            return true;
    }
}