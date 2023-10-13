const { collection, query, where, getDocs,addDoc} = require("firebase/firestore");

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
            console.error("Errore durante il recupero dei documenti da Firestore:", error);
        }
        return array;
    }

async function insertRuoloTipoclasse({role, tipoClasse, guild})
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        role: role,
        tipoClasse: tipoClasse,
        date: new Date(),
        guild: guild.name,
        guildId: guild.id
        };
        try {
        const collecttion = collection(firebaseConnect.db, "RuoloTipoClasse");
        const docRef = await addDoc(collecttion, dataDaInserire);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
}

module.exports = {
    getRuoloTipoClasse,
    insertRuoloTipoclasse
    };