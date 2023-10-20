const { collection, query, where, getDocs,addDoc, getDoc,updateDoc} = require("firebase/firestore");

async function insertImages({arrayLink, author, idGuild, nameGuild})
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        idGuild: idGuild,
        nameGuild:nameGuild,
        author: author,
        images: arrayLink,
        inAttesaDiValidazione:true,
        validazione:false,
        date: new Date()
        };
        try {
        const collecttion = collection(firebaseConnect.db, "ImmaginiContest");
        const docRef = await addDoc(collecttion, dataDaInserire);
    } catch (error) {
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
                author: doc.data().author,
                date: doc.data().date,
                destination: doc.data().destination,
                idGuild: doc.data().idGuild,
                nameGuild:doc.data().nameGuild,
                images: doc.data().images,
            };
            array.push(object);
        });
        return array;
    } catch (error) {
        console.error("Si è verificato un errore durante la query:", error);
        throw error; 
    }
  }

module.exports = {insertImages,getImages}