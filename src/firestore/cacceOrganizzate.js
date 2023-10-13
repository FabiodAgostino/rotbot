const { collection, query, where, getDocs,addDoc, getDoc,updateDoc} = require("firebase/firestore");
const utils = require('../utils.js');
const dungeon = require('./dungeon.js');
const ruoloTipoClasseService = require('./ruoloTipoClasse.js');



async function getCacceOrganizzateDocument(soloOggi,guildId) {
  const firebaseConnect = require('./firebaseConnect.js');
  const collectionRef = collection(firebaseConnect.db, "CacciaOrganizzata");

  let que =query(collectionRef, where("guildId","==",guildId));

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  if (soloOggi) 
    que = query(collectionRef, where("date", ">=", startOfDay), where("date", "<", endOfDay), where("guildId","==",guildId));

  try {
      const array = [];
      const querySnapshot = await getDocs(que);
      querySnapshot.forEach((doc) => {
          const object = {
              author: doc.data().author,
              date: doc.data().date,
              destination: doc.data().destination,
              guild: { name: doc.data().guild, id: doc.data().guildId },
              subscribers: doc.data().subscribers,
              messageId:doc.data().messageId,
              channelId:doc.data().channelId
          };
          array.push(object);
      });
      return array;
  } catch (error) {
      console.error("Si è verificato un errore durante la query:", error);
      throw error; 
  }
}


async function getCacceTempoLootDocument(guildId,nomeDungeon) {
  const firebaseConnect = require('./firebaseConnect.js');
  const collectionRef = collection(firebaseConnect.db, "CacciaOrganizzataTempoLoot");


  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()-0.2);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  console.log(nomeDungeon)
  let que = query(collectionRef, where("date", ">=", startOfDay), where("date", "<", endOfDay), where("guildId","==",guildId), where("destination","==",nomeDungeon));

  try {
      const array = [];
      const querySnapshot = await getDocs(que);
      querySnapshot.forEach((doc) => {
          const object = {
              author: doc.data().author,
              date: doc.data().date,
              destination: doc.data().destination,
              guild: { name: doc.data().guild, id: doc.data().guildId },
              subscribers: doc.data().subscribers,
              channelId:doc.data().channelId,
              messageId:doc.data().messageId,
              reference: doc.ref,
          };
          array.push(object);
      });
      return array;
  } catch (error) {
      console.error("Si è verificato un errore durante la query:", error);
      throw error; 
  }
}

async function insertCacciaTempoLoot({author, destination, guild, messageId,channelId}) {
    const firebaseConnect = require('./firebaseConnect.js');
    const dataDaInserire = {
        author: author,
        destination: destination,
        loot: [],
        date: new Date(),
        guildName: guild.name,
        guildId: guild.id,
        messageId:messageId,
        channelId:channelId
    };
    try {
        const collectionRef = collection(firebaseConnect.db, "CacciaOrganizzataTempoLoot"); 
        const docRef = await addDoc(collectionRef, dataDaInserire);
    } catch (error) {
        console.error("Error writing document: ", error);
    }
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

    } else {
      console.log("Il documento non esiste.");
    }
  } catch (error) {
    console.error("Errore durante l'aggiornamento del documento:", error);
    throw error;
}
}
module.exports = {getCacceOrganizzateDocument,getCacceTempoLootDocument, insertCacciaTempoLoot,updateCacciaTempoLoot,getUsersFromReaction}