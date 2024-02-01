const { collection, getDocs,addDoc,query,where,updateDoc,getDoc} = require("firebase/firestore");
const utils = require('../utils.js'); 

async function getAllSkills() 
    {
        const firebaseConnect = require('./firebaseConnect.js');
        const collect = collection(firebaseConnect.db, "Skill");

        let que = query(collect, where("idTipologiaSkill","==","0"));

        var array = new Array();
        try {
            var array = new Array();

            const querySnapshot = await getDocs(que);
            
            querySnapshot.forEach((doc) => {
                array.push({name:doc.data().nome, emoji: doc.data().emoji, max: doc.data().max});
        });
        array.push({name:"Scovare nascondigli",emoji:"👁️",max:"100"});
        array.push({name:"Cercare tracce",emoji:"🐺",max:"100"});
        array.push({name:"Scassinare",emoji:"🔓",max:"100"});
        array.push({name:"Disarmare trappole",emoji:"💣",max:"100"});
        array.push({name:"Identificare oggetti",emoji:"💫",max:"100"});


        } catch (error) {
            console.log("getAllSkills KO");
            console.error("Errore durante il recupero dei documenti da Firestore:", error);
        }
        console.log("getAllSkills OK");
        return array.sort(utils.confrontoPerNome);
    }

async function getAllSkillsGuild(idGuild) 
    {
        const firebaseConnect = require('./firebaseConnect.js');
        const collect = collection(firebaseConnect.db, "SkillUtenteDiscord");

        let que = query(collect, where("idGuild","==",idGuild));

        var array = new Array();
        try {
            var array = new Array();

            const querySnapshot = await getDocs(que);
            
            querySnapshot.forEach((doc) => {
                array.push({author:doc.data().author, name: doc.data().name, min: doc.data().min,max: doc.data().max});
        });
        } catch (error) {
            console.log("getAllSkillsGuild KO");
            console.error("Errore durante il recupero dei documenti da Firestore:", error);
        }
        console.log("getAllSkillsGuild OK");
        return array;
    }

async function getSingleSkillAuthor(idGuild,idAuthor,name) 
{
    const firebaseConnect = require('./firebaseConnect.js');
    const collect = collection(firebaseConnect.db, "SkillUtenteDiscord");

    let que = query(collect, where("idGuild","==",idGuild),where("idAuthor","==",idAuthor),where("name","==",name));

    var array = new Array();
    try {
        var array = new Array();

        const querySnapshot = await getDocs(que);
        
        querySnapshot.forEach((doc) => {
            array.push({author:doc.data().author, name: doc.data().name, min: doc.data().min,max: doc.data().max, ref:doc.ref});
    });
    } catch (error) {
        console.log("getSingleSkillAuthor KO");
        console.error("Errore durante il recupero dei documenti da Firestore:", error);
    }
    console.log("getSingleSkillAuthor OK");
    return array;
}

async function getSkillsAuthor(idGuild,idAuthor) 
{
    const firebaseConnect = require('./firebaseConnect.js');
    const collect = collection(firebaseConnect.db, "SkillUtenteDiscord");

    let que = query(collect, where("idGuild","==",idGuild),where("idAuthor","==",idAuthor));

    var array = new Array();
    try {
        var array = new Array();

        const querySnapshot = await getDocs(que);
        
        querySnapshot.forEach((doc) => {
            array.push({author:doc.data().author, name: doc.data().name, min: doc.data().min,max: doc.data().max, ref:doc.ref});
    });
    } catch (error) {
        console.log("getSkillsAuthor KO");
        console.error("Errore durante il recupero dei documenti da Firestore:", error);
    }
    console.log("getSkillsAuthor OK");
    return array;
}

async function insertSkill({name, author, idGuild, min,max,idAuthor})
    {
        console.log(name,author,idGuild,min,max)
        const firebaseConnect = require('./firebaseConnect.js');
        const dataDaInserire = {
            id: crypto.randomUUID(),
            idGuild: idGuild,
            author: author,
            name: name,
            min:min,
            max:max,
            idAuthor:idAuthor
            };
            try {
            const collecttion = collection(firebaseConnect.db, "SkillUtenteDiscord");
            const docRef = await addDoc(collecttion, dataDaInserire);
            console.log("insertSkill OK");
            return false;
        } catch (error) {
            console.log("insertSkill KO");
            console.error("Error writing document: ", error);
            return true;
        }
    }
async function updateSkill(newData,ref) {
    try {
        const documentSnapshot = await getDoc(ref);
    
        if (documentSnapshot.exists()) {
        const existingData = documentSnapshot.data();
    
        const updatedData = {
            ...existingData,
            ...newData,
        };
    
        await updateDoc(ref, updatedData); // Utilizza newData.reference
        console.log("updateSkill OK");
        } else {
        console.log("Il documento non esiste.");
        return true;
        }
    } catch (error) {
        console.log("updateSkill KO");
        console.error("Errore durante l'aggiornamento del documento:", error);
        return false;
    }
    }

async function insertOrUpdateSkills({name, author, idGuild, min,max,idAuthor})
{
    var data = await getSingleSkillAuthor(idGuild,idAuthor,name);
    if(data.length>0)
    {
        var newData = {name:name, author:author, idGuild:idGuild, min:min, max:max};
        var result=await updateSkill(newData,data[0].ref);

        if(result)
            throw new Error("Errore");
        else
            return "Modifica della skill "+name+" effettuato! "
    }
    else
    {
        var result = await insertSkill({name:name, author:author, idGuild:idGuild, min:min, max:max, idAuthor:idAuthor});
        if(result)
            throw new Error("Errore");
        else
            return "Salvataggio della skill "+name+" effettuato! "
    }
}
    
module.exports = {getAllSkills,insertSkill,insertOrUpdateSkills,getAllSkillsGuild,getSkillsAuthor}