const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  guildID: { type: String, required: true },
  money: { type: Number, default: 0 },
  items: { type: Array, default: [] }
});

module.exports = mongoose.model('user', userSchema);
