const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-panel')
        .setDescription('Crée le panel des tickets')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("🎫 Service Tickets – Normandie RP")
            .setDescription("Clique sur le bouton ci-dessous pour ouvrir un ticket.\nNotre équipe te répondra dès que possible.")
            .setColor("#2b2d31");

        const bouton = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('create_ticket')
                .setLabel('📩 Ouvrir un ticket')
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            content: "🎫 Panel des tickets envoyé.",
            ephemeral: true
        });

        await interaction.channel.send({
            embeds: [embed],
            components: [bouton]
        });
    }
};
