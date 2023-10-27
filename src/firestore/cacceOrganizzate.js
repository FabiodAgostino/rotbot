const { collection, query, where, getDocs,addDoc, getDoc,updateDoc} = require("firebase/firestore");
const utils = require('../utils.js');
const dungeon = require('./dungeon.js');
const ruoloTipoClasseService = require('./ruoloTipoClasse.js');



async function getCacceOrganizzateDocument(soloOggi,guildId,nomeDungeon) {
  const firebaseConnect = require('./firebaseConnect.js');
  const collectionRef = collection(firebaseConnect.db, "CacciaOrganizzata");
  let que =query(collectionRef, where("guildId","==",guildId), where("destination","==",nomeDungeon));

  try {
      const array = [];
      const querySnapshot = await getDocs(que);
      querySnapshot.forEach((doc) => {
          const object = {
              id:doc.data().id,
              author: doc.data().author,
              date: doc.data().date,
              destination: doc.data().destination,
              guild: { name: doc.data().guild, id: doc.data().guildId },
              messageId:doc.data().messageId,
              channelId:doc.data().channelId,
              finita:doc.data().finita,
          };
          array.push(object);
      });
      console.log("getCacceOrganizzateDocument OK");
      return array;
  } catch (error) {
      console.log("getCacceOrganizzateDocument KO");
      console.error("Si è verificato un errore durante la query:", error);
      throw error; 
  }
}

async function getCacceOrganizzateDocumentById(guildId,id) {
  const firebaseConnect = require('./firebaseConnect.js');
  const collect = collection(firebaseConnect.db, "CacciaOrganizzata");
  id = parseInt(id);
  let que =query(collect, where("guildId","==",guildId), where("id","==",id), where("finita","==",false));
  let ref;
  const querySnapshot = await getDocs(que);
  try {

      var array = new Array();
      querySnapshot.forEach((doc) => {
          const object = {
              id:doc.data().id,
              author: doc.data().author,
              date: doc.data().date,
              destination: doc.data().destination,
              guild: { name: doc.data().guild, id: doc.data().guildId },
              messageId:doc.data().messageId,
              channelId:doc.data().channelId,
              finita:doc.data().finita,
          };
          array.push(object);
      ref = doc.ref;
      });
      console.log("getCacceOrganizzateDocumentById OK");
  } catch (error) {
      console.log("getCacceOrganizzateDocumentById KO");
      console.error("Errore durante il recupero dei documenti da Firestore:", error);
  }
  return {data:array,ref:ref};
}

async function updateCacciaOrganizzata(newData,ref) {
  try {
    const documentSnapshot = await getDoc(ref);

    if (documentSnapshot.exists()) {
      const existingData = documentSnapshot.data();

      const updatedData = {
        ...existingData,
        ...newData,
      };

      await updateDoc(ref, updatedData); // Utilizza newData.reference
      console.log("updateCacciaOrganizzata OK");
    } else {
      console.log("Il documento non esiste.");
    }
  } catch (error) {
    console.log("updateCacciaOrganizzata KO");
    console.error("Errore durante l'aggiornamento del documento:", error);
    throw error;
  }
}


async function getCacceTempoLootDocument(guildId,id) {
  const firebaseConnect = require('./firebaseConnect.js');
  const collectionRef = collection(firebaseConnect.db, "CacciaOrganizzataTempoLoot");
  const idN = parseInt(id);
  let que = query(collectionRef, where("guildId","==",guildId),where("id","==",idN));
  
  try {
      const array = [];
      const querySnapshot = await getDocs(que);
      querySnapshot.forEach((doc) => {
          const object = {
              id: doc.data().id,
              author: doc.data().author,
              date: doc.data().date,
              destination: doc.data().destination,
              guild: { name: doc.data().guildName, id: doc.data().guildId },
              subscribers: doc.data().subscribers,
              channelId:doc.data().channelId,
              messageId:doc.data().messageId,
              reference: doc.ref,
              tempo:doc.data().tempo,
              stoppata: doc.data().stoppata,
              dateFinish: doc.data().dateFinish
          };
          array.push(object);
      });
      console.log("getCacceTempoLootDocument OK");
      return array;
  } catch (error) {
      console.log("getCacceTempoLootDocument KO");
      console.error("Si è verificato un errore durante la query:", error);
      throw error; 
  }
}

async function insertCacciaTempoLoot({author, destination, guild, messageId,channelId,id},isManuale=false,data=null) {
    const firebaseConnect = require('./firebaseConnect.js');
    
    const dataDaInserire = {
        id: parseInt(id),
        author: author,
        destination: destination,
        date: new Date(),
        guildName: guild.name,
        guildId: guild.id,
        messageId:messageId,
        channelId:channelId
    };
    if(isManuale)
    {
      dataDaInserire.isManuale=true;
      dataDaInserire.id= utils.idRnd();
      dataDaInserire.sangue= data.sangue;
      dataDaInserire.monete= data.monete;
      dataDaInserire.frammenti = data.frammenti;
      dataDaInserire.nuclei = data.nuclei;
      dataDaInserire.finita = data.finita;
      id=dataDaInserire.id;
    }
    try {
        const collectionRef = collection(firebaseConnect.db, "CacciaOrganizzataTempoLoot"); 
        const docRef = await addDoc(collectionRef, dataDaInserire);
        console.log("insertCacciaTempoLoot OK");
    } catch (error) {
        console.error("Error writing document: ", error);
        console.log("insertCacciaTempoLoot KO");

    }
    return id;
}

async function getUsersFromReaction(client, channelId, messageId, dungeonName, guildId,interaction) {
  const channel = client.channels.cache.get(channelId);

  if (!channel) {
    console.log('Canale non trovato.');
    return [];
  }

  // Rimuovi il messaggio dalla cache
  channel.messages.cache.delete(messageId);

  const emojiDungeon = (await dungeon.getDungeonDocuments()).find(x => x.name === dungeonName)?.emoji;
  const rolesToSearch = await ruoloTipoClasseService.getRuoloTipoClasse(guildId);

  if (!emojiDungeon) {
    console.log('Emoji non trovata.');
    return [];
  }
  const targetMessage = await channel.messages.fetch(messageId);


  if (!targetMessage) {
    console.log('Messaggio non trovato.');
    return [];
  }

  const reactions = targetMessage.reactions.cache.filter(reaction => reaction.emoji.name === emojiDungeon);
  if (!reactions.size) {
    console.log('Nessuna reazione con l\'emoji desiderata.');
    return [];
  }

  const usersWithRoles = [];

  await Promise.all(reactions.map(async (reaction) => {
    if (reaction && reaction.users && reaction.users.cache.size > 0) {
      const users = await reaction.users.fetch();
      const usersArray = Array.from(users.values());
      await Promise.all(usersArray.map(async (user) => {
        const member = await interaction.guild.members.fetch(user);
        if (member) {
          const rolesArray = Array.from(member.roles.cache.values()).map(role => role.name);
          const tipoClasse = rolesToSearch.find(roleInfo => rolesArray.includes(roleInfo.role))?.tipoClasse;
          
          if (tipoClasse != undefined) {
            usersWithRoles.push({ username: user.username, roles: tipoClasse });
          } else {
            usersWithRoles.push({ username: user.username, roles: "" });
          }
        }
      }));
    }
  }));
  return usersWithRoles.filter(x=> x.username!="ROTBOT");
}
async function updateCacciaTempoLoot(documentReference, newData)
{
  try
  {
    const documentSnapshot = await getDoc(documentReference);

    if (documentSnapshot.exists()) {
      const existingData = documentSnapshot.data();

      const updatedData = {
        ...existingData,
        ...newData,
      };

      await updateDoc(documentReference, updatedData);
      console.log("updateCacciaTempoLoot OK")
    } else {
      console.log("Il documento non esiste.");
    }
  } catch (error) {
    console.log("updateCacciaTempoLoot KO")
    console.error("Errore durante l'aggiornamento del documento:", error);
    throw error;
}
}
module.exports = {getCacceOrganizzateDocument,getCacceTempoLootDocument, insertCacciaTempoLoot,updateCacciaTempoLoot,getUsersFromReaction,getCacceOrganizzateDocumentById,updateCacciaOrganizzata}