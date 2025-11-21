const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../schemas/userSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('inventaire')
    .setDescription('Affiche ton inventaire'),
  async execute(interaction) {
    let user = await User.findOne({ userID: interaction.user.id, guildID: interaction.guild.id });
    if (!user) user = { money: 0, items: [] };

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username} — Inventaire`)
      .addFields(
        { name: '💶 Argent', value: `${user.money}`, inline: true },
        { name: '📦 Objets', value: user.items.length ? user.items.map(i => i.name).join(', ') : 'Aucun' }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
