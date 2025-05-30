const { collection, query, where, getDocs,addDoc} = require("firebase/firestore");
const utils = require('../utils.js'); 

async function insertServer({idGuild, name})
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        id: idGuild,
        name: name,
        date: utils.getDateUTF1(),
        };
        try {
        const collecttion = collection(firebaseConnect.db, "ServerDiscord");
        const docRef = await addDoc(collecttion, dataDaInserire);
        console.log("insertServer OK");
    } catch (error) {
        console.log("insertServer KO");
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
        console.log("getServer OK");
        return array;
    } catch (error) {
        console.log("getServer KO");
        console.error("Si è verificato un errore durante la query:", error);
        throw error; 
    }
  }

  async function getAllServers() {
    const firebaseConnect = require('./firebaseConnect.js');
    const collectionRef = collection(firebaseConnect.db, "ServerDiscord");
  
  
    try {
        const array = [];
        const querySnapshot = await getDocs(collectionRef);
        querySnapshot.forEach((doc) => {
            const object = {
                id: doc.data().id,
                date: doc.data().date,
                name: doc.data().name
            };
            array.push(object);
        });
        console.log("getAllServers OK");
        return array;
    } catch (error) {
        console.log("getAllServers KO");
        console.error("Si è verificato un errore durante la query:", error);
        throw error; 
    }
  }

module.exports = {insertServer,getServer,getAllServers}