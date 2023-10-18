const { collection, query, where, getDocs,addDoc} = require("firebase/firestore");


async function insertServer({idGuild, name})
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        id: idGuild,
        name: name,
        date: new Date(),
        };
        try {
        const collecttion = collection(firebaseConnect.db, "ServerDiscord");
        const docRef = await addDoc(collecttion, dataDaInserire);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}

async function getServer(guildId) {
    const firebaseConnect = require('./firebaseConnect.js');
    const collectionRef = collection(firebaseConnect.db, "ServerDiscord");
  
    let que =query(collectionRef, where("id","==",guildId));
  
    try {
        const array = [];
        const querySnapshot = await getDocs(que);
        querySnapshot.forEach((doc) => {
            const object = {
                id: doc.data().id,
                date: doc.data().date,
                name: doc.data().name
            };
            array.push(object);
        });
        return array;
    } catch (error) {
        console.error("Si è verificato un errore durante la query:", error);
        throw error; 
    }
  }

module.exports = {insertServer,getServer}