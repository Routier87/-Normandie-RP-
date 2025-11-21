const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sondage')
    .setDescription('Créer un sondage simple')
    .addStringOption(o => o.setName('question').setDescription('La question').setRequired(true))
    .addStringOption(o => o.setName('options').setDescription('Sépare les options par des virgules').setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('question');
    const options = interaction.options.getString('options').split(',').map(s => s.trim()).filter(Boolean);
    if (options.length < 2) return interaction.reply({ content: 'Il faut au moins 2 options.', ephemeral: true });
    if (options.length > 6) return interaction.reply({ content: 'Maximum 6 options.', ephemeral: true });

    const emojis = ['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣'];
    const embed = new EmbedBuilder()
      .setTitle('📊 Sondage')
      .setDescription(question)
      .addFields({ name: 'Options', value: options.map((o,i)=> `${emojis[i]} ${o}`).join('\n')})
      .setFooter({ text: `Créé par ${interaction.user.username}` });

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    for (let i = 0; i < options.length; i++) {
      await msg.react(emojis[i]);
    }
  }
};
