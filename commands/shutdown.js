// commands/shutdown.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Éteint le bot (uniquement pour le propriétaire).'),

    async execute(interaction, client) {
        // Remplace par ton ID Discord
        const ownerId = 'TON_ID_DISCORD_ICI';

        if (interaction.user.id !== ownerId) {
            return interaction.reply({ content: '❌ Vous n’êtes pas autorisé à utiliser cette commande.', ephemeral: true });
        }

        await interaction.reply('⚠️ Bot en cours d’arrêt...');

        console.log(`🛑 Le bot a été arrêté par ${interaction.user.tag}`);

        // Déconnecte le bot de Discord
        client.destroy();

        // Ferme le processus Node.js
        process.exit(0);
    }
};
