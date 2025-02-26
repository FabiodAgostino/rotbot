const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");


var db;

async function connectFirebase()
    {
        const firebaseConfig = {
            apiKey: "",
            authDomain: "rotiniel-35c5b.firebaseapp.com",
            projectId: "rotiniel-35c5b",
            storageBucket: "rotiniel-35c5b.appspot.com",
            messagingSenderId: "",
            appId: "",
            measurementId: ""
        };
        
        const app = initializeApp(firebaseConfig);
        this.db = getFirestore(app);

        console.log(this.db!=undefined ? "Connessione con firebase avvenuta con successo" : "Nessuna connessione avvenuta");
    }
module.exports = {connectFirebase,db}
