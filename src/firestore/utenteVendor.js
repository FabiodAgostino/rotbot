const { collection, getDocs,addDoc,query,where,updateDoc,getDoc} = require("firebase/firestore");
const utils = require('../utils.js'); 

async function insertOrUpdateVendor({list, owner,idOwner, idGuild,name})
{
    var data = await this.getVendorAuthor({idGuild:idGuild, idOwner:idOwner});
    if(data!=undefined)
    {
        var nameVendor;
        //save
        if(data.name==undefined) nameVendor=name;
        if(data.name=="temp" && name!="temp") nameVendor=name;
        
        //update
        if(data.name!=undefined && data.name!="temp" && name!="temp") nameVendor=name;

        var newData = {name: nameVendor, owner:owner, idGuild:idGuild, list:list, idOwner:idOwner};
        var result=await updateVendor(newData,data.ref);

        if(result)
            throw new Error("Errore");
        else
            if(data.name!=undefined && data.name=="temp")
                return "Salvataggio del vendor "+name+" effettuato! "
            else
                return "Modifica del vendor "+name+" effettuata! "
    }
    else
       return await insertVendor({list:list, owner:owner, idOwner:idOwner, idGuild:idGuild, name:name});
}
async function getVendorAuthor({idGuild,idOwner}) 
{
    const firebaseConnect = require('./firebaseConnect.js');
    const collect = collection(firebaseConnect.db, "VendorDiscord");

    let que = query(collect, where("idGuild","==",idGuild),where("idOwner","==",idOwner));

    var array = new Array();
    try {
        var array = new Array();

        const querySnapshot = await getDocs(que);
        
        querySnapshot.forEach((doc) => {
            array.push({owner:doc.data().owner, idGuild:doc.data().idGuild,idOwner:doc.data().idOwner, name: doc.data().name, list: doc.data().list, id:doc.data().id,ref:doc.ref});
    });
    } catch (error) {
        console.log("getVendorAuthor KO");
        console.error("Errore durante il recupero dei documenti da Firestore:", error);
    }
    console.log("getVendorAuthor OK");
    return array[0];
}
async function getVendorById({idGuild,idVendor}) 
{
    const firebaseConnect = require('./firebaseConnect.js');
    const collect = collection(firebaseConnect.db, "VendorDiscord");
    let que = query(collect, where("idGuild","==",idGuild),where("id","==",idVendor));

    var array = new Array();
    try {
        var array = new Array();

        const querySnapshot = await getDocs(que);
        
        querySnapshot.forEach((doc) => {
            array.push({owner:doc.data().owner, idGuild:doc.data().idGuild,idOwner:doc.data().idOwner, name: doc.data().name, list: doc.data().list, id:doc.data().id,ref:doc.ref});
    });
    } catch (error) {
        console.log("getVendorAuthor KO");
        console.error("Errore durante il recupero dei documenti da Firestore:", error);
    }
    console.log("getVendorAuthor OK");
    return array[0];
}
async function updateVendor(newData,ref) 
{
    try {
        const documentSnapshot = await getDoc(ref);
    
        if (documentSnapshot.exists()) {
        const existingData = documentSnapshot.data();
    
        const updatedData = {
            ...existingData,
            ...newData,
        };
    
        await updateDoc(ref, updatedData); // Utilizza newData.reference
        console.log("updateVendor OK");
        } else {
        console.log("Il documento non esiste.");
        return true;
        }
    } catch (error) {
        console.log("updateVendor KO");
        console.error("Errore durante l'aggiornamento del documento:", error);
        return false;
    }
}
async function insertVendor({list, owner,idOwner, idGuild,name})
{
    var id = utils.idRnd();
        const firebaseConnect = require('./firebaseConnect.js');
        const dataDaInserire = {
            id: id,
            idGuild: idGuild,
            owner: owner,
            name: name,
            list:list,
            idOwner:idOwner
            };
            try {
            const collecttion = collection(firebaseConnect.db, "VendorDiscord");
            const docRef = await addDoc(collecttion, dataDaInserire);
            console.log("insertVendor OK");
            return id;
        } catch (error) {
            console.log("insertVendor KO");
            console.error("Error writing document: ", error);
            return true;
        }
}
async function getAllVendorGuild(idGuild) 
    {
        const firebaseConnect = require('./firebaseConnect.js');
        const collect = collection(firebaseConnect.db, "VendorDiscord");

        let que = query(collect, where("idGuild","==",idGuild));

        var array = new Array();
        try {
            var array = new Array();

            const querySnapshot = await getDocs(que);
            
            querySnapshot.forEach((doc) => {
                array.push({owner:doc.data().owner, idGuild:doc.data().idGuild,idOwner:doc.data().idOwner, name: doc.data().name, list: doc.data().list, id:doc.data().id});

        });
        } catch (error) {
            console.log("getAllVendorGuild KO");
            console.error("Errore durante il recupero dei documenti da Firestore:", error);
        }
        console.log("getAllVendorGuild OK");
        return array;
}
async function getVendorByCategoria(idGuild,categoria) 
{
    const firebaseConnect = require('./firebaseConnect.js');
    const collect = collection(firebaseConnect.db, "VendorDiscord");

    let que = query(collect, where("idGuild","==",idGuild),where("list","array-contains",categoria));

    var array = new Array();
    try {
        var array = new Array();

        const querySnapshot = await getDocs(que);
        
        querySnapshot.forEach((doc) => {
            array.push({owner:doc.data().owner, idGuild:doc.data().idGuild,idOwner:doc.data().idOwner, name: doc.data().name, list: doc.data().list, id:doc.data().id,ref:doc.ref});
    });
    } catch (error) {
        console.log("getVendorByCategoria KO");
        console.error("Errore durante il recupero dei documenti da Firestore:", error);
    }
    console.log("getVendorByCategoria OK");
    return array;
}

module.exports = {insertOrUpdateVendor,getVendorById,getVendorAuthor,getAllVendorGuild,getVendorByCategoria}
