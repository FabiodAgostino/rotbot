const {ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    EmbedBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

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
    creaLookupSenzaEmoji({list, id, placeholder})
    {
        console.log(id)
        const select = new StringSelectMenuBuilder()
			.setCustomId(id)
			.setPlaceholder(placeholder)
            .setMinValues(0)
            .setMaxValues(list.length)
			.addOptions(
				list.map((value)=>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(value)
                        .setValue(value)
                )
			);
		const row = new ActionRowBuilder().addComponents(select);
        return row;
    },

    creaEmbeded(title, text, interaction,embeds=null)
    {
        if(embeds==null)
        {
            embeds = new Array();
            embeds.push({
                name:text,
                value:"    ",
            })
        }
        
        return exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setDescription("@everyone")
        .setAuthor({ name: interaction.member.nickname, iconURL:"https://i.postimg.cc/L6CGnvzk/hacker-1.png"})
        .setThumbnail('https://i.postimg.cc/vZFpdDMf/logo-removebg-preview.png')
        .addFields(
            embeds
        )
        .setTimestamp()
        .setFooter({ text: 'RotinielToolsDev' });
    },

    creaButton(style, text,customId)
    {
        const pollButtons = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel(text)
                  .setCustomId(customId)
                  .setStyle(style),
              );
        return pollButtons;
    }
}