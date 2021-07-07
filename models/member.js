const mongoose = require("mongoose");

const MemberData = new mongoose.Schema({
  userID: {
    type: String,
    default: null,
  },
  gid: {
    type: String,
    default: null,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  bank: {
    type: Number,
    default: 0,
  },
  lastUsedDaily: {
    type: Date,
  },
  lastUsedWeekly: {
    type: Date,
  },
  inventory: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('MemberData', MemberData);