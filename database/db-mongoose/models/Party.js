const mongoose = require("mongoose");

const partySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    deadlineToVote: { type: Date, required: true },
    allowGuestProposals: { type: Boolean, default: true },
    hostName: { type: String },
    hostEmail: { type: String },
    adminToken: { type: String, required: true },
    inviteToken: { type: String, required: true },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "FINALIZED"],
      default: "OPEN"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Party", partySchema);
