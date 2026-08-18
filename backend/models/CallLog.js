const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
    },
    participantName: {
      type: String,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CallLog', callLogSchema);