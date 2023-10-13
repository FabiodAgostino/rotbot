const { collection, getDocs,addDoc } = require("firebase/firestore");

async function getDungeonDocuments() 
    {
        const firebaseConnect = require('./firebaseConnect.js');

        var array = new Array();
        try {
            const dungeonCollection = collection(firebaseConnect.db, "Dungeon");
            const querySnapshot = await getDocs(dungeonCollection);
            
            querySnapshot.forEach((doc) => {
                array.push({name:doc.data().name,emoji:doc.data().emoji});
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
        author: author,
        destination: destination,
        subscribers: [],
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