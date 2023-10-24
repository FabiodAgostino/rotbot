const { collection, query, where, getDocs,addDoc, getDoc,updateDoc} = require("firebase/firestore");

async function insertImages({arrayLink, author, idGuild, nameGuild,idCaccia})
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        id: crypto.randomUUID(),
        idGuild: idGuild,
        nameGuild:nameGuild,
        author: author,
        images: arrayLink,
        inAttesaDiValidazione:true,
        validazione:false,
        date: new Date(),
        idCacciaOrganizzataTempoLoot:idCaccia,
        };
        try {
        const collecttion = collection(firebaseConnect.db, "ImmaginiContest");
        const docRef = await addDoc(collecttion, dataDaInserire);
        console.log("insertImages OK");
    } catch (error) {
        console.log("insertImages KO");
        console.error("Error writing document: ", error);
    }
}

async function getImages() {
    const firebaseConnect = require('./firebaseConnect.js');
    const collectionRef = collection(firebaseConnect.db, "ImmaginiContest");
  
    let que =query(collectionRef, where("inAttesaDiValidazione","==",true));
  
  
    try {
        const array = [];
        const querySnapshot = await getDocs(que);
        querySnapshot.forEach((doc) => {
            const object = {
                id: doc.data().id,
                author: doc.data().author,
                date: doc.data().date,
                destination: doc.data().destination,
                idGuild: doc.data().idGuild,
                nameGuild:doc.data().nameGuild,
                images: doc.data().images,
            };
            array.push(object);
        });
        console.log("getImages OK");
        return array;
    } catch (error) {
        console.log("getImages KO");
        console.error("Si è verificato un errore durante la query:", error);
        throw error; 
    }
  }

module.exports = {insertImages,getImages}