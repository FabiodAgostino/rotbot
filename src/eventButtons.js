const {ButtonInteraction, ButtonStyle,ActionRowBuilder, ButtonBuilder} = require("discord.js")
const cacceOrganizzateService = require("./firestore/cacceOrganizzate.js")
const ruoloTipoRuoloService = require("./firestore/ruoloTipoRuolo.js")
const contestService = require("./firestore/contest.js")


const generics = require('./generics.js'); 
const utils = require('./utils.js'); 
const modals = require('./modals.js'); 


const votedMembers = new Set();
module.exports = {
    async executeButtonsEvents(interaction,guild,client)
    {
        if(!interaction.isButton())return;

        const information = await ruoloTipoRuoloService.getGuardInformation(interaction,guild);

        await this.buttonSondaggioSiNo(interaction,information);
        await this.buttonStartCaccia(interaction,information,guild);
        await this.buttonStopCaccia(interaction,information,guild,client);
        await this.buttonCaricaImmagine(interaction,information,guild,client);
        await this.buttonDividi(interaction, information, guild, client);
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

                interaction.reply({content:VoteCountedReply, ephemeral:true})
                interaction.message.edit({embeds:[pollEmbed]});
                break;

            case "no":
                const newNoCount = parseInt(noField.value) + 1;
                noField.value = newNoCount;

                interaction.reply({content:VoteCountedReply, ephemeral:true})
                interaction.message.edit({embeds:[pollEmbed]});
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

        const author = splittedArray[2];
        const dungeon = splittedArray[3];
        const idChannel= splittedArray[4];
        const idMessage =splittedArray[5];
        
        const result=(await cacceOrganizzateService.getCacceTempoLootDocument(guild.id,dungeon)).filter(x=> x.tempo==undefined);
        if(result==undefined || result.length>0)
        {
            interaction.reply({
                content:"Questa caccia è già stata startata  "+ utils.getRandomEmojiFelici(),
                ephemeral:true
            })
            return;
        }
        await cacceOrganizzateService.insertCacciaTempoLoot({author:author, destination:dungeon, guild:{name:guild.name, id:guild.id}, messageId:idMessage, channelId:idChannel});
        const buttonStop=generics.creaButton(ButtonStyle.Danger,"Stop!","button-stop-"+author+"-"+dungeon+"-"+guild.name+"-"+guild.id);
        interaction.reply(
        {
            content:"Premi il tasto stop quando hai terminato la caccia! "+ utils.getRandomEmojiFelici(),
            ephemeral:true,
            components:[buttonStop]
        })
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
        const dataAttuale= new Date();
        const dungeon = splittedArray[3];

        const result=(await cacceOrganizzateService.getCacceTempoLootDocument(guild.id,dungeon)).filter(x=> x.tempo==null);
        
        if(result==null || result.length==0)
        {
            await interaction.reply({content:"Questa caccia è già terminata. "+ utils.getRandomEmojiFelici(), ephemeral:true});
            return;
        }
        const buttons = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel('Dividi')
                  .setCustomId("button-dividi"+"-"+dungeon+"-"+dataAttuale)
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setLabel("Carica immagine")
                  .setCustomId("button-image"+"-"+dungeon+"-"+dataAttuale)
                  .setStyle(ButtonStyle.Primary)
              );

        interaction.reply(
        {
            content:"Premi il tasto **'Dividi'** se vuoi procedere subito alla divisione, oppure il bottone **'Carica immagine'** se vuoi inserire un'immagine da far validare per il contest.  "+ utils.getRandomEmojiFelici(),
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

        const dungeon = splittedArray[2];
        const dataAttuale = splittedArray[3];
        interaction.showModal(modals.modaleImmagini());
        
        const submitted = await interaction.awaitModalSubmit({
            time: 150000,
            filter: i => i.user.id === interaction.user.id,
          }).catch(error => {
            console.error(error)
            return null
          })
        if(submitted==null)
        {
            await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
            return;
        }

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

        const author = submitted.user.globalName==undefined ? submitted.user.username : submitted.user.globalName;
        const buttonDividi=generics.creaButton(ButtonStyle.Success,"Dividi","button-dividi"+"-"+dungeon+"-"+dataAttuale);
        try
        {
            if (submitted) {
                await submitted.deferReply({ ephemeral: true }); 
                await contestService.insertImages({arrayLink:arrayLink,author:author,idGuild:guild.id, nameGuild:guild.name})
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

        const dungeon = splittedArray[2];
        const dataAttuale = splittedArray[3];

        const result=(await cacceOrganizzateService.getCacceTempoLootDocument(guild.id,dungeon)).filter(x=> x.tempo==null);

        interaction.showModal(modals.modaleStopCaccia());
        const usersFromReaction=await cacceOrganizzateService.getUsersFromReaction(client,result[0].channelId,result[0].messageId,dungeon,guild.id,interaction);

        const submitted = await interaction.awaitModalSubmit({
            time: 150000,
            filter: i => i.user.id === interaction.user.id,
          }).catch(error => {
            console.error(error)
            return null
          })

        if(submitted==null)
        {
            await interaction.followUp({content:"Una volta aperta la modale hai 60 secondi per rispondere, riesegui il comando e sii più rapido! "+await utils.getRandomEmojiFelici(), ephemeral:true});
            return;
        }

        const fields = submitted.fields;
        const soldi=fields.getTextInputValue("soldi");
        const frammenti=fields.getTextInputValue("frammenti");
        const fama=fields.getTextInputValue("fama");
        const nucleiFormidabili=fields.getTextInputValue("nucleiFormidabili");
        const sangue=fields.getTextInputValue("sangue");
        const tempo = utils.differenceBetweenTwoTimeStamp(result[0].date);

        let embedFields = new Array();
        embedFields.push({name:"🕙 Tempo: __"+tempo.hours+"__ ora __"+tempo.minutes+"__ minuti __"+tempo.seconds+"__ secondi.", value:"    "})
        embedFields.push({name:"🪙  Monete: "+soldi, value:"    "})
        embedFields.push({name:"❄️  Frammenti: "+frammenti, value:"    "})
        embedFields.push({name:"⬆️  Fama: "+fama, value:"     "})
        embedFields.push( {name:"🔮  Nuclei: "+nucleiFormidabili, value:"    "})
        embedFields.push( {name:"⚗️  Sangue: "+sangue, value:"     "})

        const newData = {
            dateFinish: dataAttuale,
            userList: usersFromReaction.map(x=> x.username),
            userRole: usersFromReaction.map(x=> x.roles).filter(x=> x!=""),
            fama: fama,
            monete: soldi,
            frammenti: frammenti,
            nuclei: nucleiFormidabili,
            sangue: sangue,
            tempo:tempo}

        const embeds = generics.creaEmbeded("Resoconto caccia a "+dungeon,"",interaction,embedFields);
        try
        {
            if (submitted) {
                const message=await submitted.reply({
                    content:"I risultati verranno salvati su RotinielTools e sarà possibile visualizzarli accedendo alla propria area personale.",
                    embeds:[embeds],
                    fetchReply:true
                });
                cacceOrganizzateService.updateCacciaTempoLoot(result[0].reference, newData)
            }
        }
        catch(error)
        {
            console.log(error);
        }
        
    }

}