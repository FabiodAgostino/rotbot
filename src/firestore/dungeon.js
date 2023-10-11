const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs,addDoc } = require("firebase/firestore");

var db;
var app;
async function connectFirebase()
    {
        const firebaseConfig = {
            apiKey: "AIzaSyBNWbqdAaq44dWHELm2m1jU0xY6graA9uo",
            authDomain: "rotiniel-35c5b.firebaseapp.com",
            projectId: "rotiniel-35c5b",
            storageBucket: "rotiniel-35c5b.appspot.com",
            messagingSenderId: "546264380520",
            appId: "1:546264380520:web:b09f4bc5e62c611818f7dd",
            measurementId: "G-VXQ0LYQVDB"
        };
        
        app = initializeApp(firebaseConfig);
        db = getFirestore();
    }
async function getDungeonDocuments() 
    {
        var array = new Array();
        try {
            const dungeonCollection = collection(db, "Dungeon");
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
async function insertCacciaOrganizzata({author, destination})
{
    const dataDaInserire = {
        author: author,
        destination: destination,
        subscribers: [],
        date: new Date() // La data corrente
      };
      try {
        const cacciaOrganizzataCollection = collection(db, "CacciaOrganizzata");
        const docRef = await addDoc(cacciaOrganizzataCollection, dataDaInserire);
    } catch (error) {
        console.error("Error writing document: ", error);
    }

}

module.exports = {
    connectFirebase,
    async getAllDungeon() {
        return await getDungeonDocuments();
    },
    insertCacciaOrganizzata
    };