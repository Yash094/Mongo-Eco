const mongoose = require("mongoose");

const GuildData = new mongoose.Schema({
  gid: {
    type: String,
    default: null,
  },
  shopItems: {
    type: Array,
    default: []
  },
  weeklyAmt: {
    type: String,
    default: 10000
  },
   dailyAmt: {
    type: String,
    default: 2000
  }
});

module.exports = mongoose.model('GuildData', GuildData);