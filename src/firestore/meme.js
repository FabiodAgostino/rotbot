const { collection, query, where, getDocs,addDoc} = require("firebase/firestore");


async function insertMeme({idGuild, author, meme})
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        idGuild: idGuild,
        author: author,
        date: new Date(),
        meme: meme
        };
        try {
        const collecttion = collection(firebaseConnect.db, "Meme");
        const docRef = await addDoc(collecttion, dataDaInserire);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}
async function insertTicket({idGuild, author, type, text})
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        idGuild: idGuild,
        user: author,
        date: new Date(),
        messaggio: text,
        tipologia:type,
        id: crypto.randomUUID(),
        isRotbot: true
        };
        try {
        const collecttion = collection(firebaseConnect.db, "Ticket");
        const docRef = await addDoc(collecttion, dataDaInserire);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}

async function getAllMeme(guildId) {
    const firebaseConnect = require('./firebaseConnect.js');
    const collectionRef = collection(firebaseConnect.db, "Meme");
  
    let que =query(collectionRef, where("idGuild","==",guildId));
  
    try {
        const array = [];
        const querySnapshot = await getDocs(que);
        querySnapshot.forEach((doc) => {
            const object = {
                author: doc.data().author,
                date: doc.data().date,
                meme: doc.data().meme
            };
            array.push(object);
        });
        return array;
    } catch (error) {
        console.error("Si è verificato un errore durante la query:", error);
        throw error; 
    }
  }
async function getRandomMeme(guildId)
{
    const array =await getAllMeme(guildId);
    const indiceCasuale = Math.floor(Math.random() * array.length);
    console.log(indiceCasuale)
    return array[indiceCasuale].meme;
}

  module.exports = {
    getAllMeme,
    insertMeme,
    getRandomMeme,
    insertTicket
    };