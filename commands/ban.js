const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Exclut un membre du serveur')
    .addUserOption(o => o.setName('membre').setDescription('Membre à exclure').setRequired(true))
    .addStringOption(o => o.setName('raison').setDescription('Raison du ban')),
  async execute(interaction) {
    if (!interaction.member.permissions.has('BanMembers')) return interaction.reply({ content: 'Permission manquante.', ephemeral: true });
    const membre = interaction.options.getUser('membre');
    const raison = interaction.options.getString('raison') || 'Aucune raison fournie';
    const guildMember = await interaction.guild.members.fetch(membre.id).catch(()=>null);
    if (!guildMember) return interaction.reply({ content: 'Membre introuvable.', ephemeral: true });

    await guildMember.ban({ reason: `${raison} — par ${interaction.user.tag}` }).catch(err => {
      console.error(err);
      return interaction.reply({ content: 'Impossible de ban ce membre.', ephemeral: true });
    });

    await interaction.reply({ content: `🔨 ${membre.tag} a été banni. Raison: ${raison}` });
  }
};
