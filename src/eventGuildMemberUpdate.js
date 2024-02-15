const ruoloTipoRuolo = require('./firestore/ruoloTipoRuolo.js'); 
const utils = require('./utils.js'); 


module.exports =
{
    sendInstuction
}

async function sendInstuction(guildId,newMember, oldMember)
{
    var ruoli=await ruoloTipoRuolo.getRuoloTipoRuolo(guildId);
    var ruoliUtente = ruoli.filter(x=> x.tipoRuolo=="utente").map(x=> x.role);

    const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
    var roleSelected = [];
    addedRoles.forEach(role => {
        roleSelected.push(role.name);
    });

    if(ruoliUtente.includes(roleSelected[0]))
    {
        const user = newMember.user;
        try {
            var message = "Benvenuto nel server di "+ruoli[0].guild+"! "+utils.getRandomEmojiFelici()+"\nTi è stato settato il ruolo "+roleSelected[0]+" quindi ora hai accesso ai canali interni del server.\n\nAppena ti "+
            "è possibile invia richiesta di accesso al forum seguendo questa procedura (*skippa questa parte se non sei gildato):\n 1)Navighi all'indirizzo https://themiraclegdr.com/forum/index.php\n2)Accedi\n"+
            "3)Clicca in alto a destra sul bottone del tuo profilo\n4)Clicca su 'Control panel' e successivamente sulla tab 'Usergroup'\n5)Check sul forum di gilda e submit sul bottone in basso.\n\n"+
            "Ti chiedo inoltre di inserire le skills che ha il tuo pg (o che hai intenzione di alzare) all'interno del bot usando il comando /insert-update-skills, e di inserire il tuo eventuale vendor "+
            "con il comando /insert-update-vendor.\nPer leggere la lista completa dei comandi lancia il comando /show-all-commands.\nPer accedere ai tools e altri contenuti di TM naviga sul sito: https://fabiodagostino.github.io/rot/ (se sei un utente del server di Rotiniel effettuando la login visualizzerai contenuti extra).\n"+
            "Per eventuali problemi contatta lo sviluppatore: yoridyonenloke\n\n" +
            "Grazie della collaborazione e buon gioco! "+utils.getRandomEmojiFelici()+"\n\n\n"+
            "*i comandi del bot verranno eseguiti solo se digitati all'interno del server "+ruoli[0].guild;

            await user.send(message);
        } catch (error) {
            console.error(`Errore nell'invio del messaggio al nuovo utente: ${error}`);
        }
    }
}