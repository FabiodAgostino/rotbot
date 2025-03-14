const { collection, query, where, getDocs,addDoc} = require("firebase/firestore");
const utils = require('../utils.js'); 

async function getRuoloTipoClasse(guildId, role=null) 
    {
        const firebaseConnect = require('./firebaseConnect.js');
        const collect = collection(firebaseConnect.db, "RuoloTipoClasse");

        let que = query(collect, where("guildId","==",guildId));

        if(role!=null)
            que = query(collect, where("guildId","==",guildId),where("role","==",role));
        try {
            const querySnapshot = await getDocs(que);
            var array = new Array();
            querySnapshot.forEach((doc) => {
                array.push({role:doc.data().role,tipoClasse:doc.data().tipoClasse, guildId:doc.data().guild.id});
        });
        } catch (error) {
        console.log("getRuoloTipoClasse OK");

            console.error("Errore durante il recupero dei documenti da Firestore:", error);
        }
        console.log("getRuoloTipoClasse KO");

        return array;
    }

async function insertRuoloTipoclasse({role, tipoClasse, guild})
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        role: role,
        tipoClasse: tipoClasse,
        date: utils.getDateUTF1(),
        guild: guild.name,
        guildId: guild.id
        };
        try {
        const collecttion = collection(firebaseConnect.db, "RuoloTipoClasse");
        const docRef = await addDoc(collecttion, dataDaInserire);
        console.log("insertRuoloTipoclasse OK");
    } catch (error) {
        console.log("insertRuoloTipoclasse KO");
        console.error("Error writing document: ", error);
    }
}

module.exports = {
    getRuoloTipoClasse,
    insertRuoloTipoclasse
    };