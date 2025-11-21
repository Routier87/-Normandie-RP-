const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        // 🔹 Gestion des commandes slash
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: "❌ Une erreur est survenue lors de l'exécution de la commande.",
                    ephemeral: true
                });
            }
        }

        // 🔹 Gestion des BUTTONS (Ticket)
        if (interaction.isButton()) {

            // --- Création d'un ticket ---
            if (interaction.customId === "create_ticket") {

                // Check si un ticket existe déjà
                const existing = interaction.guild.channels.cache.find(c =>
                    c.name === `ticket-${interaction.user.id}`
                );

                if (existing) {
                    return interaction.reply({
                        content: "❌ Tu as déjà un ticket ouvert.",
                        ephemeral: true
                    });
                }

                // Création du salon ticket
                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.id}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        },
                        {
                            id: interaction.client.user.id,
                            allow: [PermissionFlagsBits.ViewChannel]
                        }
                    ]
                });

                // Embed dans le ticket
                const embed = new EmbedBuilder()
                    .setTitle("🎫 Ticket ouvert")
                    .setDescription("Un membre du staff va bientôt prendre en charge ta demande.")
                    .setColor("#2b2d31");

                await channel.send({
                    content: `<@${interaction.user.id}>`,
                    embeds: [embed]
                });

                return interaction.reply({
                    content: `🎫 Ton ticket a été ouvert : ${channel}`,
                    ephemeral: true
                });
            }
        }
    }
};
