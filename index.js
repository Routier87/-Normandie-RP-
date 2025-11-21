// Chargement des variables d'environnement
require('dotenv').config();

// 🔹 Test rapide pour vérifier les variables d'environnement
console.log("MONGO =", process.env.MONGO);
console.log("TOKEN =", process.env.TOKEN);

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Création du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// Commandes
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// Schéma XP
const Xp = require('./schemas/xpSchema');

// Quand le bot est prêt
client.once('ready', () => {
  console.log(`✅ Normandie RP prêt — connecté en tant que ${client.user.tag}`);
});

// Interaction (slash commands)
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction, client);
  } catch (err) {
    console.error(err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Une erreur est survenue.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
    }
  }
});

// Système XP simple (messages)
client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (message.content.length < 5) return; // anti-spam basique

  let data = await Xp.findOne({ userID: message.author.id, guildID: message.guild.id });
  if (!data) data = new Xp({ userID: message.author.id, guildID: message.guild.id });

  const gained = Math.floor(Math.random() * 11) + 5;
  data.xp += gained;

  const needed = data.level * 100;
  if (data.xp >= needed) {
    data.level += 1;
    data.xp = data.xp - needed;
    message.channel.send(`🎉 **${message.author.username}** est monté au niveau **${data.level}** !`);
  }

  await data.save();
});

// 🔹 Connexion à MongoDB et au bot
if (!process.env.MONGO || !process.env.TOKEN) {
  console.error("❌ ERREUR : Les variables MONGO ou TOKEN ne sont pas définies dans le fichier .env !");
  process.exit(1);
}

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connecté.');
  client.login(process.env.TOKEN);
})
.catch(err => {
  console.error('❌ Erreur connexion MongoDB:', err);
});

client.on("interactionCreate", (interaction) => {
    require('./events/interactionCreate.js').execute(interaction);
});
