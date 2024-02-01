const {ButtonInteraction, ButtonStyle,ActionRowBuilder, ButtonBuilder} = require("discord.js")
const cacceOrganizzateService = require("./firestore/cacceOrganizzate.js")
const ruoloTipoRuoloService = require("./firestore/ruoloTipoRuolo.js")
const skillService = require("./firestore/skills.js")
const contestService = require("./firestore/contest.js")


const generics = require('./generics.js'); 
const utils = require('./utils.js'); 
const modals = require('./modals.js'); 


const votedMembers = new Set();
module.exports = {
    async executeButtonsEvents(interaction,guild,client,information)
    {
        if(!interaction.isButton())return;

        await this.buttonSondaggioSiNo(interaction,information);
        await this.buttonStartCaccia(interaction,information,guild);
        await this.buttonStopCaccia(interaction,information,guild,client);
        await this.buttonCaricaImmagine(interaction,information,guild,client);
        await this.buttonDividi(interaction, information, guild, client);
        await this.buttonStep2(interaction, information, guild, client);
        await this.buttonStep3(interaction, information, guild, client);
        await this.buttonStep3(interaction, information, guild, client);
        await this.buttonInsertSkill(interaction, information, guild, client);


    },
    async buttonSondaggioSiNo(interaction,information)
    {
        const splittedArray = interaction.customId.split('-');

        if(splittedArray[0]!=="poll") return;
        if(!information.isUtente)
        {
            await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
            return;
        }

        if(votedMembers.has(interaction.user.id+"-"+interaction.message.id))
            return interaction.reply({content:"Hai già votato "+ utils.getRandomEmojiFelici(), ephemeral:true});

        votedMembers.add(interaction.user.id+"-"+interaction.message.id);
        const pollEmbed = interaction.message.embeds[0];

        if(!pollEmbed)return interaction.reply({
            content:"Errore",
            ephemeral:true
        });

        const yesField = pollEmbed.fields[0];
        const noField = pollEmbed.fields[1];
        const VoteCountedReply = "Il tuo voto è stato conteggiato!";
        switch(splittedArray[1])
        {
            case "si":
                const newYesCount = parseInt(yesField.value) + 1;
                yesField.value = newYesCount;

                await interaction.reply({content:VoteCountedReply, ephemeral:true})
                interaction.message.edit({embeds:[pollEmbed]});
                break;

            case "no":
                const newNoCount = parseInt(noField.value) + 1;
                noField.value = newNoCount;

                interaction.reply({content:VoteCountedReply, ephemeral:true})
                await interaction.message.edit({embeds:[pollEmbed]});
                break;
        }
    },
    async buttonStartCaccia(interaction,information,guild)
    {
        const splittedArray = interaction.customId.split('-');

        if(splittedArray[1]!=="start") return;
        if(!information.isUtente)
        {
            await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
            return;
        }

        const id = splittedArray[2];
        
        const result=await cacceOrganizzateService.getCacceOrganizzateDocumentById(guild.id,id);
        if(result.data.length==0)
        {
            await interaction.reply({content:"La caccia è stata già startata!", ephemeral:true});
            return;
        }
        let ref= result.ref;
        const cacciaOrganizzata= result.data[0];

        const author = cacciaOrganizzata.author;
        const destination = cacciaOrganizzata.destination;
        const idMessage = cacciaOrganizzata.messageId;
        const idChannel = cacciaOrganizzata.channelId;
        cacciaOrganizzata.finita=true;
        try
        {
            await cacceOrganizzateService.insertCacciaTempoLoot({author:author, destination:destination, guild:{name:guild.name, id:guild.id}, messageId:idMessage, channelId:idChannel,id:id});
            await cacceOrganizzateService.updateCacciaOrganizzata(cacciaOrganizzata,ref);
            const buttonStop=generics.creaButton(ButtonStyle.Danger,"Stop!","button-stop-"+id);
            await interaction.update(
            {
                content:"Premi il tasto stop quando hai terminato la caccia! "+ utils.getRandomEmojiFelici(),
                ephemeral:true,
                components:[buttonStop]
            })
        }
        catch(error)
        {
            console.log(error);
        }
        
    },
    async buttonStopCaccia(interaction,information,guild,client)
    {
        const splittedArray = interaction.customId.split('-');

        if(splittedArray[1]!=="stop") return;
        if(!information.isUtente)
        {
            await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
            return;
        }
        const id = splittedArray[2];

        try
        {
            const result=(await cacceOrganizzateService.getCacceTempoLootDocument(guild.id,id)).filter(x=> x.tempo==null);
            if(result[0].stoppata)
            {
                await interaction.reply({content:"Questa caccia è stata già stoppata! "+ utils.getRandomEmojiFelici(), ephemeral:true});
                return;
            }
            const data = result[0];
            const newData = {
                stoppata:true,
                dateFinish:utils.getDateUTF1()
            }
            await cacceOrganizzateService.updateCacciaTempoLoot(data.reference,newData);
        }
        catch(error)
        {
            console.log(error);
            return;
        }
        
        const buttons = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel('Dividi')
                  .setCustomId("button-dividi"+"-"+id)
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setLabel("Carica immagine")
                  .setCustomId("button-image"+"-"+id)
                  .setStyle(ButtonStyle.Primary)
              );
        
        await interaction.update(
        {
            content:"Premi il tasto **'Dividi'** se vuoi procedere subito alla divisione, oppure il bottone **'Carica immagine'** se vuoi inserire screenshot da far validare per il contest.  "+ utils.getRandomEmojiFelici(),
            ephemeral:true,
            components:[buttons]
        })

    },
    async buttonCaricaImmagine(interaction,information,guild,client)
    {
        const splittedArray = interaction.customId.split('-');

        if(splittedArray[1]!=="image") return;
        if(!information.isUtente)
        {
            await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
            return;
        }

        const id = splittedArray[2];

        const result=(await cacceOrganizzateService.getCacceTempoLootDocument(guild.id,id)).filter(x=> x.tempo==null);
        if(!result[0])
        {
            await interaction.reply({content:"Questa caccia è già terminata! "+ utils.getRandomEmojiFelici(), ephemeral:true});
            return;
        }
        await interaction.showModal(modals.modaleImmagini(interaction.id));
        
        const submitted = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter =
                    i.user.id === interaction.user.id &&
                    i.customId === `modaleCaricaImmagini-${interaction.id}`;
                return filter;
            },
            time: 100000,
          }).catch(async x=>{
                await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
                return;
          });
          if(submitted===undefined)
            return;

        const fields = submitted.fields;
        const img1=fields.getTextInputValue("link1");
        const img2=fields.getTextInputValue("link2");
        const img3=fields.getTextInputValue("link3");
        const img4=fields.getTextInputValue("link4");
        const img5=fields.getTextInputValue("link5");
        let arrayLink = [];

        if(img1!=null && img1!='')
            arrayLink.push(img1)
        if(img2!=null && img2!='')
            arrayLink.push(img2)
        if(img3!=null && img3!='')
            arrayLink.push(img3)
        if(img4!=null && img4!='')
            arrayLink.push(img4)
        if(img5!=null && img5!='')
            arrayLink.push(img5)

        const buttonDividi=generics.creaButton(ButtonStyle.Success,"Dividi","button-dividi"+"-"+id);
        try
        {
            if (submitted) {
                await submitted.deferReply({ ephemeral: true }); 
                await contestService.insertImages({arrayLink:arrayLink,author:information.author,idGuild:guild.id, nameGuild:guild.name,idCaccia:id})
                const message=await submitted.editReply({
                    content:"Premi il tasto dividi quando vuoi cominciare la divisione!  "+ utils.getRandomEmojiFelici(),
                    components:[buttonDividi],
                });
            }
        }
        catch(error)
        {
            console.log(error);
        }
    },
    async buttonDividi(interaction,information,guild,client)
    {
        const splittedArray = interaction.customId.split('-');

        if(splittedArray[1]!=="dividi") return;
        if(!information.isUtente)
        {
            await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
            return;
        }

        const id = splittedArray[2];

        const result=(await cacceOrganizzateService.getCacceTempoLootDocument(guild.id,id)).filter(x=> x.tempo==null);
        if(!result[0])
        {
            await interaction.reply({content:"Questa caccia è già terminata! "+ utils.getRandomEmojiFelici(), ephemeral:true});
            return;
        }
        await interaction.showModal(modals.modaleStopCaccia(interaction.id));
        const usersFromReaction=await cacceOrganizzateService.getUsersFromReaction(client,result[0].channelId,result[0].messageId,result[0].destination,guild.id,interaction);

        const submitted = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter =
                    i.user.id === interaction.user.id &&
                    i.customId === `modaleStopCaccia-${interaction.id}`;
                return filter;
            },
            time: 100000,
            }).catch(async x=>{
                await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
                return;
            });
        if(submitted===undefined)
            return;

        const fields = submitted.fields;
        const soldi=fields.getTextInputValue("soldi");
        const frammenti=fields.getTextInputValue("frammenti");
        const fama=fields.getTextInputValue("fama");
        const nucleiFormidabili=fields.getTextInputValue("nucleiFormidabili");
        const sangue=fields.getTextInputValue("sangue");
        const tempo = utils.differenceBetweenTwoTimeStamp(result[0].date, result[0].dateFinish);

        let embedFields = new Array();
        embedFields.push({name:"🕙 Tempo: __"+tempo.hours+"__ ora __"+tempo.minutes+"__ minuti __"+tempo.seconds+"__ secondi.", value:"    "})
        embedFields.push({name:"🪙  Monete: "+soldi, value:"    "})
        embedFields.push({name:"❄️  Frammenti: "+frammenti, value:"    "})
        embedFields.push({name:"⬆️  Fama: "+fama, value:"     "})
        embedFields.push( {name:"🗡️  Armi 4/5: "+nucleiFormidabili, value:"    "})
        embedFields.push( {name:"⚗️  Sangue: "+sangue, value:"     "})

        const newData = {
            userList: usersFromReaction.map(x=> x.username),
            userRole: usersFromReaction.map(x=> x.roles).filter(x=> x!=""),
            fama: fama,
            monete: soldi,
            frammenti: frammenti,
            nuclei: nucleiFormidabili,
            sangue: sangue,
            tempo:tempo,
            finita: true}

        const embeds = generics.creaEmbeded("Resoconto caccia a "+result[0].destination,"",interaction,embedFields);
        try
        {
            if (submitted) {
                const message=await submitted.update({
                    content:"Rendo la card pubblica 🔽",
                    embeds:[],
                    components:[],
                    fetchReply:true,
                    ephemeral:false
                });
                await submitted.followUp({
                    content:"I risultati verranno salvati su RotinielTools e sarà possibile visualizzarli accedendo alla propria area personale.",
                    embeds:[embeds],
                    components:[],
                    fetchReply:true,
                    ephemeral:false
                });
                await cacceOrganizzateService.updateCacciaTempoLoot(result[0].reference, newData)
            }
        }
        catch(error)
        {
            console.log(error);
        }
        
    },
    async buttonStep2(interaction,information,guild,client)
    {
        const splittedArray = interaction.customId.split('-');

        if(splittedArray[0]!=="step2") return;
        if(!information.isAdmin)
        {
            await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
            return;
        }
        const id = splittedArray[1];

        await interaction.showModal(modals.modaleImmagini(interaction.id));
        
        const submitted = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter =
                    i.user.id === interaction.user.id &&
                    i.customId === `modaleCaricaImmagini-${interaction.id}`;
                return filter;
            },
            time: 100000,
          }).catch(async x=>{
                await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
                return;
          });
          if(submitted===undefined)
            return;

        const fields = submitted.fields;
        const img1=fields.getTextInputValue("link1");
        const img2=fields.getTextInputValue("link2");
        const img3=fields.getTextInputValue("link3");
        const img4=fields.getTextInputValue("link4");
        const img5=fields.getTextInputValue("link5");
        let arrayLink = [];

        if(img1!=null && img1!='')
            arrayLink.push(img1)
        if(img2!=null && img2!='')
            arrayLink.push(img2)
        if(img3!=null && img3!='')
            arrayLink.push(img3)
        if(img4!=null && img4!='')
            arrayLink.push(img4)
        if(img5!=null && img5!='')
            arrayLink.push(img5)

        try
        {
            await contestService.insertImages({arrayLink:arrayLink,author:information.author,idGuild:guild.id, nameGuild:guild.name,idCaccia:id})
            const avanti = generics.creaButton(ButtonStyle.Primary,"Avanti","step3-"+id);
            if (submitted) {
                await submitted.update({
                    content:"Procedi nell'inserimento della caccia andando allo step 3! "+utils.getRandomEmojiFelici(),
                    components:[avanti],
                    ephemeral:true,
                    fetchReply:true
                });
            }
        }
        catch(error)
        {
            console.log(error);
        }
    return;
    },
    async buttonStep3(interaction,information,guild,client)
    {
        const splittedArray = interaction.customId.split('-');

        if(splittedArray[0]!=="step3") return;
        if(!information.isAdmin)
        {
            await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
            return;
        }
        const id = splittedArray[1];

        await interaction.showModal(modals.modaleStep3(interaction.id));
        const submitted = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter =
                    i.user.id === interaction.user.id &&
                    i.customId === `modaleStep3-${interaction.id}`;
                return filter;
            },
            time: 100000,
          }).catch(async x=>{
                await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
                return;
          });
          if(submitted===undefined)
            return;

        const fields = submitted.fields;
        const tempo=fields.getTextInputValue("tempo");
        var numPg=fields.getTextInputValue("numPg");
        numPg = parseInt(numPg);

        try
        {
            const newData = {
                tempoManuale: tempo,
                numPg:numPg,
                finita: true,
                stoppata:true}
            const result=await cacceOrganizzateService.getCacceTempoLootDocument(guild.id,id);
            await cacceOrganizzateService.updateCacciaTempoLoot(result[0].reference,newData);
            if (submitted) {
                await submitted.update({
                    content:"Hai terminato l'inserimento dei dati della caccia! "+utils.getRandomEmojiFelici(),
                    components:[],
                    ephemeral:true,
                });
            }
        }
        catch(error)
        {
            console.log(error);
        }
    return;
    },
    async buttonInsertSkill(interaction,information,guild,client)
    {
        const splittedArray = interaction.customId.split('-');

        if(splittedArray[0]!=="buttonSkill") return;
        if(!information.isUtente)
        {
            await interaction.reply({content:"Non sei abilitato per accedere a questa funzione! 😡", ephemeral:true});
            return;
        }

        await interaction.showModal(modals.modaleInserisciSkills(interaction.id,splittedArray[1],splittedArray[2]));

        const submitted = await interaction.awaitModalSubmit({
            filter: async (i) => {
                const filter =
                    i.user.id === interaction.user.id &&
                    i.customId === `modaleInsertSkill-${interaction.id}`;
                return filter;
            },
            time: 100000,
          }).catch(async x=>{
                await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
                return;
          });
          if(submitted===undefined)
            return;

        const fields = submitted.fields;
        const min=fields.getTextInputValue("min");
        const massimo=fields.getTextInputValue("max");
        const massimoStabilito = parseInt(splittedArray[2]);
        try
        {
            let minValue = parseInt(min);
            let maxValue = parseInt(massimo);
            
            if(isNaN(minValue) || isNaN(maxValue))
            {
                await submitted.update({
                    content:"Sono accettati solo valori numerici! "+utils.getRandomEmojiFelici(),
                    components:[],
                    ephemeral:true,
                });
            }
            else if((minValue>maxValue) || (minValue<0 || maxValue<0))
            {
                await submitted.update({
                    content:"Stai tentando di fregarmi? "+utils.getRandomEmojiRisposta(),
                    components:[],
                    ephemeral:true,
                });
            }
            else if(maxValue>200)
            {
                await submitted.update({
                    content:"Non esistono skills che arrivano a "+maxValue+"! "+utils.getRandomEmojiRisposta(),
                    components:[],
                    ephemeral:true,
                });
            }
            else if(maxValue>massimoStabilito)
            {
                await submitted.update({
                    content:"Questa skill non arriva a "+maxValue+"! "+utils.getRandomEmojiRisposta(),
                    components:[],
                    ephemeral:true,
                });
            }
            else
            {
                try
                {
                    var nickname = interaction.member.nickname;
                    var user = (nickname != undefined && nickname!="") ? nickname : interaction.user.globalName;
                    var result=await skillService.insertOrUpdateSkills({name:splittedArray[1],author:user, idGuild:guild.id,min:minValue, max:massimo,idAuthor:interaction.user.id });
                 
                    await submitted.update({
                        content:result+utils.getRandomEmojiFelici(),
                        components:[],
                        ephemeral:true,
                    });
                }
                
                catch(errore)
                {
                    await submitted.update({
                        content:"bro errore senti ioridion! "+utils.getRandomEmojiFelici(),
                        components:[],
                        ephemeral:true,
                    });
                }
            }
        }catch(error)
        {
            console.log(error)
        }
    }

}