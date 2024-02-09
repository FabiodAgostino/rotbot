const VERSION = "1.0.2-b02";

var responseSondaggioSiNo = [];

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
    { name: 'Zarr Vagor',value:19,emoji:"🪦" },
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

const emojiLavorative =
[
    { name: 'Falegnameria',value:1,emoji:"🪚"},
    { name: 'Forgiare utensili',value:2,emoji:"🛠️" },
    { name: 'Cartografia',value:3,emoji:"🗺️" },
    { name: 'Cucinare',value:4,emoji:"🍲" },
    { name: 'Forgiare armi',value:5,emoji:"🔨" },
    { name: 'Cercare minerali',value:6,emoji:"⛏️" },
    { name: 'Costruire archi',value:7,emoji:"🏹" },
    { name: 'Alchimia',value:8,emoji:"⚗️" },
    { name: 'Pescare',value:9,emoji:"🎣" },
    { name: 'Agricoltura',value:10,emoji:"🌱" },
    { name: 'Fare legna',value:11,emoji:"🪓" },
    { name: 'Erboristeria',value:12,emoji:"🌿" },
    { name: 'Cucire',value:13,emoji:"🧵" },
    { name: 'Scovare nascondigli',value:14,emoji:"👁️" },
    { name: 'Cercare tracce',value:15,emoji:"🐺" },
    { name: 'Scassinare',value:16,emoji:"🔓" },
    { name: 'Disarmare trappole',value:17,emoji:"💣" },
    { name: 'Identificare oggetti',value:18,emoji:"💫" },
]

const categorieVendor =
[
    { name: 'Falegnameria',value:1,emoji:"🪚"},
    { name: 'Forgiare utensili',value:2,emoji:"🛠️" },
    { name: 'Mappe',value:3,emoji:"🗺️" },
    { name: 'Cibo/cibo per potenziamenti',value:4,emoji:"🍲" },
    { name: 'Armi e armature',value:5,emoji:"🔨" },
    { name: 'Lingotti e leghe',value:6,emoji:"⛏️" },
    { name: 'Archi, balestre e frecce',value:7,emoji:"🏹" },
    { name: 'Pozioni e prodotti alchemici',value:8,emoji:"⚗️" },
    { name: 'Pesce e pescetti',value:9,emoji:"🎣" },
    { name: 'Agricoltura (cibo e reagenti)',value:10,emoji:"🌱" },
    { name: 'Legna',value:11,emoji:"🪓" },
    { name: 'Erboristeria (Polveri, loti neri, ecc)',value:12,emoji:"🌿" },
    { name: 'Sartoria e armature in cuoio',value:13,emoji:"🧵" },
    { name: 'Sangue',value:14,emoji:"🩸" },
    { name: 'Cristalli, frammenti, polveri',value:15,emoji:"❄️" },
    { name: 'Armi incantate',value:17,emoji:"⚔️" },
    { name: 'Oggettini',value:17,emoji:"💍" },
    { name: 'Nuclei e frammenti essenza cristallizzata',value:18,emoji:"🧊" },
]

module.exports =
{
    dungeons,
    classiTM,
    VERSION,
    emojiLavorative,
    categorieVendor,
    responseSondaggioSiNo,
    getCategorieVendor()
    {
        return categorieVendor.sort(this.confrontoPerNome);
    },
    getEmojiLavorativeByName(name)
    {
        return emojiLavorative.filter(x=> x.name.toLowerCase()==name.toLowerCase())[0].emoji;
    },
    convertTimeStampToDate(timestamp)
    {
        var data = new Date(timestamp);
        var giorno = data.getDate();
        var mese = data.getMonth() + 1;
        var anno = data.getFullYear();
        return giorno + '/' + mese + '/' + anno;
    },
    idRnd()
    {
        const value = new Uint32Array(1);
        return crypto.getRandomValues(value)[0];
    },
    convertDateToDateNormal(date)
    {
        return date.getDate() + '/' + (date.getMonth()+1) + '/' + date.getFullYear();
    },
    getHours(date)
    {
        return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    },
    parseTimeString(timeString) {
        try
        {
            const [hours, minutes, seconds] = timeString.split(':').map(Number);
            const date = utils.getDateUTF1();
            date.setHours(hours || 0);
            date.setMinutes(minutes || 0);
            date.setSeconds(seconds || 0);
            return date;
        }
        catch(error)
        {
            console.log("parseTimeString KO");
            console .log(error);
            return null;
        }
      },
    differenceBetweenTwoTimeStamp(date,dateFinish)
    {
        let dataInizioInMillisecondi = date.seconds * 1000 + date.nanoseconds / 1000000;
        let dataFineInMillisecondi = dateFinish.seconds * 1000 + dateFinish.nanoseconds / 1000000;

        let differenzaInMillisecondi = dataFineInMillisecondi - dataInizioInMillisecondi;

        let secondi = Math.floor((differenzaInMillisecondi / 1000) % 60);
        let minuti = Math.floor((differenzaInMillisecondi / (1000 * 60)) % 60);
        let ore = Math.floor((differenzaInMillisecondi / (1000 * 60 * 60)) % 24);

        return {hours:ore, minutes:minuti, seconds: secondi};
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
    },
    getDateUTF1() {
        let date = new Date();
        let currentTime = date.getTime();
        let offset = 60 * 60 * 1000; 
        let timeInUTCPlus1 = currentTime + offset;
        let dateInUTCPlus1 = new Date(timeInUTCPlus1);
      
        return dateInUTCPlus1;
      },
    confrontoPerNome(a, b) {
        const nomeA = a.name.toUpperCase(); // Ignora maiuscole/minuscole
        const nomeB = b.name.toUpperCase();
      
        if (nomeA < nomeB) {
          return -1;
        }
        if (nomeA > nomeB) {
          return 1;
        }
      
        return 0; // Nomi uguali
      },
    getData() {
        const dataCorrente = new Date();
    
        const giorno = String(dataCorrente.getUTCDate()).padStart(2, '0');
        const mese = String(dataCorrente.getUTCMonth() + 1).padStart(2, '0'); // Mesi in JavaScript sono 0-based
        const anno = dataCorrente.getUTCFullYear();
    
        const ora = String(dataCorrente.getUTCHours() + 1).padStart(2, '0'); // UTC+1
        const minuto = String(dataCorrente.getUTCMinutes()).padStart(2, '0');
        const secondo = String(dataCorrente.getUTCSeconds()).padStart(2, '0');
    
        const dataFormattata = `${giorno}/${mese}/${anno} ${ora}:${minuto}:${secondo}`;
    
        return dataFormattata;
    },
    isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
}