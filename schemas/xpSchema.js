const mongoose = require('mongoose');

const xpSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }
});

module.exports = mongoose.model('xp', xpSchema);
