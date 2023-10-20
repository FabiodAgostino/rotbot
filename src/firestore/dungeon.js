const { collection, getDocs,addDoc } = require("firebase/firestore");
const utils = require('../utils.js'); 

async function getDungeonDocuments() 
    {
        const firebaseConnect = require('./firebaseConnect.js');

        var array = new Array();
        try {
            const dungeonCollection = collection(firebaseConnect.db, "Dungeon");
            const querySnapshot = await getDocs(dungeonCollection);
            
            querySnapshot.forEach((doc) => {
                array.push({id:doc.data().id,name:doc.data().name,emoji:doc.data().emoji});
        });
        } catch (error) {
            console.error("Errore durante il recupero dei documenti da Firestore:", error);
        }
        const x= array.sort((a, b) => a.name.localeCompare(b.name));;
        return x;
    }
async function insertCacciaOrganizzata({author, destination, guild,idMessage, idChannel})
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        id: utils.idRnd(),
        author: author,
        destination: destination,
        date: new Date(),
        guild: guild.name,
        guildId: guild.id,
        messageId: idMessage,
        channelId:idChannel
      };
      try {
        const cacciaOrganizzataCollection = collection(firebaseConnect.db, "CacciaOrganizzata");
        const docRef = await addDoc(cacciaOrganizzataCollection, dataDaInserire);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}

module.exports = {
    getDungeonDocuments,
    insertCacciaOrganizzata
    };