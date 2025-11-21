const { SlashCommandBuilder } = require('discord.js');
const User = require('../schemas/userSchema');

const items = {
  pain: { id: 'pain', name: 'Pain', price: 10 },
  epee: { id: 'epee', name: 'Épée rouillée', price: 150 }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('acheter')
    .setDescription('Acheter un objet en boutique')
    .addStringOption(o => o.setName('id').setDescription('ID de l\'objet').setRequired(true)),
  async execute(interaction) {
    const id = interaction.options.getString('id');
    const item = items[id];
    if (!item) return interaction.reply({ content: 'Objet introuvable.', ephemeral: true });

    let user = await User.findOne({ userID: interaction.user.id, guildID: interaction.guild.id });
    if (!user) {
      user = new User({ userID: interaction.user.id, guildID: interaction.guild.id });
    }

    if (user.money < item.price) return interaction.reply({ content: 'Tu n\'as pas assez d\'argent.', ephemeral: true });

    user.money -= item.price;
    user.items.push({ id: item.id, name: item.name });
    await user.save();

    await interaction.reply({ content: `✅ Tu as acheté **${item.name}** pour ${item.price} 💶` });
  }
};
