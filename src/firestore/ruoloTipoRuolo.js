const { collection, query, where, getDocs,addDoc} = require("firebase/firestore");
const utils = require('../utils.js'); 

async function getRuoloTipoRuolo(guildId,role=null,tipoRuolo=null) 
    {
        const firebaseConnect = require('./firebaseConnect.js');
        const collect = collection(firebaseConnect.db, "RuoloTipoRuolo");

        let que = query(collect, where("guildId","==",guildId));

        if(role!=null)
            que = query(collect, where("guildId","==",guildId),where("idRole","==",role.id),where("tipoRuolo","==",tipoRuolo));

        var array = new Array();
        try {
            var array = new Array();

            const querySnapshot = await getDocs(que);
            
            querySnapshot.forEach((doc) => {
                array.push({role:doc.data().role,tipoRuolo:doc.data().tipoRuolo, guildId:doc.data().guildId});
        });
        } catch (error) {
            console.log("getRuoloTipoRuolo KO");
            console.error("Errore durante il recupero dei documenti da Firestore:", error);
        }
        console.log("getRuoloTipoRuolo OK");
        return array;
    }

async function insertRuoloTipoRuolo({role, tipoRuolo, guild})
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        role: role.name,
        tipoRuolo: tipoRuolo,
        date: utils.getDateUTF1(),
        guild: guild.name,
        guildId: guild.id,
        idRole:role.id
        };
        try {
        const collecttion = collection(firebaseConnect.db, "RuoloTipoRuolo");
        const docRef = await addDoc(collecttion, dataDaInserire);
        console.log("insertRuoloTipoRuolo OK");
    } catch (error) {
        console.log("insertRuoloTipoRuolo KO");
        console.error("Error writing document: ", error);
    }
}

async function insertRuoloValidatore(user)
{
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        username:user?.globalName==undefined ? user?.username : user?.globalName,
        idUser:user.id,
        isValidatore:true,
        date: utils.getDateUTF1(),
        };
        try {
        const collecttion = collection(firebaseConnect.db, "RuoloTipoRuolo");
        const docRef = await addDoc(collecttion, dataDaInserire);
        console.log("insertRuoloValidatore OK");
    } catch (error) {
        console.log("insertRuoloValidatore KO");
        console.error("Error writing document: ", error);
    }
}

async function getValidatori() 
    {
        const firebaseConnect = require('./firebaseConnect.js');
        const collect = collection(firebaseConnect.db, "RuoloTipoRuolo");

        let que = query(collect, where("isValidatore","==",true));

        var array = new Array();
        try {
            var array = new Array();

            const querySnapshot = await getDocs(que);
            
            querySnapshot.forEach((doc) => {
                array.push({username:doc.data().username,idUser:doc.data().idUser, isValidatore:doc.data().isValidatore});
        });
        } catch (error) {
            console.log("getValidatori OK");
            console.error("Errore durante il recupero dei documenti da Firestore:", error);
        }
        console.log("getValidatori KO");
        return array;
    }

async function getRuoliUtente(guildId,ruoloUtente) 
{
    const firebaseConnect = require('./firebaseConnect.js');
    const collect = collection(firebaseConnect.db, "RuoloTipoRuolo");

    let que = query(collect, where("guildId","==",guildId),where("ripoRuolo","==",ruoloUtente));

    var array = new Array();
    try {
        var array = new Array();

        const querySnapshot = await getDocs(que);
        
        querySnapshot.forEach((doc) => {
            array.push({role:doc.data().role,tipoRuolo:doc.data().tipoRuolo, guildId:doc.data().guild.id});
    });
    } catch (error) {
        console.log("getRuoliUtente OK");
        console.error("Errore durante il recupero dei documenti da Firestore:", error);
    }
    console.log("getRuoliUtente KO");
    return array;
}

async function getGuardInformation(interaction, guild)
{
    const rolesGuild=await this.getRuoloTipoRuolo(guild.id);
    const value=await utils.isUtenteOrAdmin(rolesGuild,interaction);
    var isAdmin=false;
    var isUtente=false;
    const author = interaction.user.globalName==undefined ? interaction.user.username : interaction.user.globalName;
    if(value=="admin")
    {
        isAdmin=utils.isAdmin(value);
        isUtente = isAdmin ? true : false;
    }
    if(value=="utente")
        isUtente=utils.isUtente(value);

    var information = {isAdmin:isAdmin, isUtente:isUtente, author:author};

    return information;
}
module.exports = {
    getRuoloTipoRuolo,
    insertRuoloTipoRuolo,
    getRuoliUtente,
    getGuardInformation,
    insertRuoloValidatore,
    getValidatori
    };