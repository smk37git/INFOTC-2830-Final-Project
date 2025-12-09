require("dotenv").config();
const mongoose = require("mongoose");
const Party = require("../models/Party");
const MovieProposal = require("../models/MovieProposal");

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Optional: clear previous seed data
    await Party.deleteMany({ name: "Friday Night Movies (Seed Script)" });
    await MovieProposal.deleteMany({ proposerName: "Varsha (Seed Script)" });

    const party = await Party.create({
      name: "Friday Night Movies (Seed Script)",
      location: "Varsha's Apartment",
      deadlineToVote: new Date("2025-12-10T23:59:00Z"),
      allowGuestProposals: true,
      hostName: "Varsha",
      hostEmail: "varsha@gmail.com",
      adminToken: "seedAdminToken",
      inviteToken: "seedInviteToken",
      status: "OPEN"
    });

    const movie = await MovieProposal.create({
      partyId: party._id,
      proposerName: "Varsha (Seed Script)",
      proposerEmail: "varsha@gmail.com",
      name: "Inception",
      category: "Sci-Fi",
      rating: "PG-13",
      runtimeMinutes: 148,
      imdbLink: "https://www.imdb.com/title/tt1375666/"
    });

    console.log("Seeded party:", party._id.toString());
    console.log("Seeded movie:", movie._id.toString());

    await mongoose.disconnect();
    console.log("Done seeding and disconnected");
  } catch (err) {
    console.error("Seed script error:", err);
    process.exit(1);
  }
}

main();
