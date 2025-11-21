const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Xp = require('../schemas/xpSchema');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('niveau')
    .setDescription('Affiche ton niveau et ton XP'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    let data = await Xp.findOne({ userID: userId, guildID: guildId });
    if (!data) data = { level: 1, xp: 0 };

    const needed = data.level * 100;
    const embed = new EmbedBuilder()
      .setTitle(`📜 Niveau de ${interaction.user.username}`)
      .addFields(
        { name: 'Niveau', value: `${data.level}`, inline: true },
        { name: 'XP', value: `${data.xp} / ${needed}`, inline: true }
      )
      .setColor('Blue');

    await interaction.reply({ embeds: [embed] });
  }
};
