const {ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,EmbedBuilder } = require('discord.js');
module.exports =
{
    creaLookup(list, id, placeholder)
    {
        const select = new StringSelectMenuBuilder()
			.setCustomId(id)
			.setPlaceholder(placeholder)
            .setMinValues(0)
            .setMaxValues(list.length)
			.addOptions(
				list.map((value)=>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(value.name)
                        .setValue(value.name)
                        .setEmoji(value.emoji)
                )
			);
		const row = new ActionRowBuilder().addComponents(select);
        return row;
    },

    creaEmbeded(title, text, interaction)
    {
        let embedFields = new Array();
        embedFields.push({
            name:text,
            value:"---------",
        })
        return exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setDescription("@everyone")
        .setAuthor({ name: interaction.user.globalName, iconURL:"https://static-00.iconduck.com/assets.00/avatar-icon-256x256-1r8gwgdd.png"})
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Anchor_pictogram_yellow.svg/845px-Anchor_pictogram_yellow.svg.png')
        .addFields(
          embedFields
        )
        .setTimestamp()
        .setFooter({ text: 'RotinielToolsDev' });
    }
}