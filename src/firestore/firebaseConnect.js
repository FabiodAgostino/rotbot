const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");


var db;

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
        
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);

        console.log(this.db!=undefined ? "Connessione con firebase avvenuta con successo" : "Nessuna connessione avvenuta");
    }
module.exports = {connectFirebase,db}