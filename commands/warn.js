const { SlashCommandBuilder } = require('discord.js');

const warns = {}; // pour prototype ; migrer en DB pour production

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Donne un avertissement à un membre')
    .addUserOption(o => o.setName('membre').setDescription('Membre à avertir').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('KickMembers')) return interaction.reply({ content: 'Permission manquante.', ephemeral: true });
    const user = interaction.options.getUser('membre');
    const reason = interaction.options.getString('raison');

    if (!warns[interaction.guild.id]) warns[interaction.guild.id] = {};
    if (!warns[interaction.guild.id][user.id]) warns[interaction.guild.id][user.id] = [];

    warns[interaction.guild.id][user.id].push({ reason, moderator: interaction.user.id, date: new Date() });

    await interaction.reply({ content: `⚠️ ${user.tag} a été averti. Raison: ${reason}` });
  }
};
