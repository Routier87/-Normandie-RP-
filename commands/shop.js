const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../schemas/userSchema');

const items = [
  { id: 'pain', name: 'Pain', price: 10, description: 'Un pain traditionnel.' },
  { id: 'epee', name: 'Épée rouillée', price: 150, description: 'Pour les duels RP.' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('boutique')
    .setDescription('Affiche la boutique'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🛒 Boutique Normandie RP')
      .setDescription(items.map(i => `**${i.name}** — ${i.price} 💶\n${i.description}`).join('\n\n'))
      .setFooter({ text: 'Utilise /acheter <id> pour acheter.' });

    await interaction.reply({ embeds: [embed] });
  }
};
