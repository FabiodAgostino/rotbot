require('dotenv').config({path:"../.env"});
const { ModalBuilder, ActionRowBuilder,
  TextInputBuilder,TextInputStyle, StringSelectMenuBuilder,StringSelectMenuOptionBuilder } = require('discord.js');

module.exports = { sondaggioData, sondaggioSiNo };


function sondaggioData()
{
    const modal = new ModalBuilder()
    .setCustomId('sondaggioGenerico')
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


function sondaggioSiNo()
{
    const modal = new ModalBuilder()
    .setCustomId('sondaggioSiNo')
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


