const {ButtonInteraction} = require("discord.js")

const votedMembers = new Set();
module.exports = {
    async executeButtonsEvents(interaction)
    {
        if(!interaction.isButton())return;

        await this.buttonSondaggioSiNo(interaction);
    },
    async buttonSondaggioSiNo(interaction)
    {
        const splittedArray = interaction.customId.split('-');

        if(splittedArray[0]!=="poll") return;

        if(votedMembers.has(interaction.user.id+"-"+interaction.message.id))
            return interaction.reply({content:"Hai già votato", ephemeral:true});

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
    }
}