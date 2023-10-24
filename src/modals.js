require('dotenv').config({path:"../.env"});
const { ModalBuilder, ActionRowBuilder,
  TextInputBuilder,TextInputStyle, StringSelectMenuBuilder,StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = { sondaggioData, sondaggioSiNo,modaleStopCaccia,sondaggioEventoDate,modaleImmagini,modaleStep3 };


function sondaggioData(interactionId)
{
    const modal = new ModalBuilder()
    .setCustomId('sondaggioGenerico-'+interactionId)
    .setTitle('Sondaggio Generico');

    const favoriteColorInput = new TextInputBuilder()
      .setCustomId('data')
      .setLabel("Data?")
      .setPlaceholder("29/10/2023")
      .setStyle(TextInputStyle.Short);

    const hobbiesInput = new TextInputBuilder()
      .setCustomId('mete')
      .setLabel("Quali sono le mete?")
      .setPlaceholder("-🍎 Mela \n-🍋 Limone \n\n Oppure...\n\n -Mela \n -Pera")
      .setStyle(TextInputStyle.Paragraph);
    
    const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
    const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);


    modal.addComponents(firstActionRow,secondActionRow);

    return modal;
}

function sondaggioEventoDate(interactionId)
{
    const modal = new ModalBuilder()
    .setCustomId('sondaggioEventoDate-'+interactionId)
    .setTitle('Sondaggio Generico');

    const favoriteColorInput = new TextInputBuilder()
      .setCustomId('meta')
      .setLabel("Meta?")
      .setPlaceholder("Kur Nughul 2")
      .setStyle(TextInputStyle.Short);

    const hobbiesInput = new TextInputBuilder()
      .setCustomId('date')
      .setLabel("Quali sono le date?")
      .setPlaceholder("-🍎 10/10/2023 \n-🍋 11/10/2023 \n\n Oppure...\n\n -10/10/2023 \n -11/10/2023")
      .setStyle(TextInputStyle.Paragraph);
    
    const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
    const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);


    modal.addComponents(firstActionRow,secondActionRow);

    return modal;
}


function sondaggioSiNo(interactionId)
{
    const modal = new ModalBuilder()
    .setCustomId('sondaggioSiNo-'+interactionId)
    .setTitle('Sondaggio base');

    const hobbiesInput = new TextInputBuilder()
      .setCustomId('question')
      .setLabel("Quali sono le mete?")
      .setPlaceholder("Inserisci qui il testo del tuo sondaggio.")
      .setStyle(TextInputStyle.Paragraph);


    const firstActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

    modal.addComponents(firstActionRow);
    return modal;
}


function modaleStopCaccia(interactionId)
{
    const modal = new ModalBuilder()
    .setCustomId(`modaleStopCaccia-${interactionId}`)
    .setTitle('Resoconto');

    const soldi = new TextInputBuilder()
      .setCustomId('soldi')
      .setLabel("🪙 Monete")
      .setPlaceholder("Inserisci qui le monete.")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

    const frammenti = new TextInputBuilder()
      .setCustomId('frammenti')
      .setLabel("❄️ Frammenti")
      .setPlaceholder("Inserisci qui i frammenti (considerando che un cristallo vale 20 frammenti).")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);
    
    const fama = new TextInputBuilder()
      .setCustomId('fama')
      .setLabel("⬆️ Fama")
      .setPlaceholder("Inserisci qui la fama ricevuta.")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);
    
    const nucleiInfusi = new TextInputBuilder()
      .setCustomId('nucleiFormidabili')
      .setLabel("🔮 Nuclei e nuclei formidabili")
      .setPlaceholder("Inserisci qui i nuclei.")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);
    
    const sangue = new TextInputBuilder()
      .setCustomId('sangue')
      .setLabel("⚗️ Fiale di sangue")
      .setPlaceholder("Inserisci qui le fiale di sangue (tutte sommate).")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);
    

    const a = new ActionRowBuilder().addComponents(soldi);
    const b = new ActionRowBuilder().addComponents(frammenti);
    const c = new ActionRowBuilder().addComponents(fama);
    const d = new ActionRowBuilder().addComponents(nucleiInfusi);
    const e = new ActionRowBuilder().addComponents(sangue);


    modal.addComponents(a,b,c,d,e);
    return modal;
}

function modaleStep3(interactionId)
{
    const modal = new ModalBuilder()
    .setCustomId('modaleStep3-'+interactionId)
    .setTitle('Informazioni finali');

    const tempo = new TextInputBuilder()
      .setCustomId('tempo')
      .setLabel("🕙 Tempo")
      .setPlaceholder("Utilizza questo formato 01:15:01")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

    const numeroPg = new TextInputBuilder()
      .setCustomId('numPg')
      .setLabel("👥 Numero pg presenti")
      .setPlaceholder("Inserisci qui il numero dei pg presenti.")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);
    

    const a = new ActionRowBuilder().addComponents(tempo);
    const b = new ActionRowBuilder().addComponents(numeroPg);


    modal.addComponents(a,b);
    return modal;
}

function modaleImmagini(interactionId)
{
  const modal = new ModalBuilder()
    .setCustomId('modaleCaricaImmagini-'+interactionId)
    .setTitle('Carica una o più immagini da validare.');

    const img1 = new TextInputBuilder()
      .setCustomId('link1')
      .setLabel("🔗 Immagine 1:")
      .setPlaceholder("Inserisci qui il link.")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

      const img2 = new TextInputBuilder()
      .setCustomId('link2')
      .setLabel("🔗 Immagine 2:")
      .setPlaceholder("Inserisci qui il link.")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

      const img3 = new TextInputBuilder()
      .setCustomId('link3')
      .setLabel("🔗 Immagine 3:")
      .setPlaceholder("Inserisci qui il link.")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

      const img4 = new TextInputBuilder()
      .setCustomId('link4')
      .setLabel("🔗 Immagine 4:")
      .setPlaceholder("Inserisci qui il link.")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

      const img5 = new TextInputBuilder()
      .setCustomId('link5')
      .setLabel("🔗 Immagine 5:")
      .setPlaceholder("Inserisci qui il link.")
      .setRequired(false)
      .setStyle(TextInputStyle.Short);
    

    const a = new ActionRowBuilder().addComponents(img1);
    const b = new ActionRowBuilder().addComponents(img2);
    const c = new ActionRowBuilder().addComponents(img3);
    const d = new ActionRowBuilder().addComponents(img4);
    const e = new ActionRowBuilder().addComponents(img5);


    modal.addComponents(a,b,c,d,e);
    return modal;
}


