const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieProposalSchema = new Schema(
  {
    partyId: { type: Schema.Types.ObjectId, ref: "Party", required: true },
    proposerName: { type: String },
    proposerEmail: { type: String },
    name: { type: String, required: true }, // movie title
    category: { type: String },
    rating: { type: String },
    runtimeMinutes: { type: Number },
    imdbLink: { type: String },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MovieProposal", movieProposalSchema);
