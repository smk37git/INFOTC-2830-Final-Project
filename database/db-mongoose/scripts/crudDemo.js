require("dotenv").config();
const mongoose = require("mongoose");
const Party = require("../models/Party");
const MovieProposal = require("../models/MovieProposal");

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // CREATE
    const party = await Party.create({
      name: "CRUD Demo Party",
      location: "Demo Location",
      deadlineToVote: new Date("2025-12-11T23:59:00Z"),
      allowGuestProposals: false,
      hostName: "Varsha",
      hostEmail: "varsha@example.com",
      adminToken: "crudAdminToken",
      inviteToken: "crudInviteToken",
      status: "OPEN"
    });

    const movie = await MovieProposal.create({
      partyId: party._id,
      proposerName: "Varsha",
      proposerEmail: "varsha@example.com",
      name: "Interstellar",
      category: "Sci-Fi",
      rating: "PG-13",
      runtimeMinutes: 169,
      imdbLink: "https://www.imdb.com/title/tt0816692/"
    });

    console.log("CREATE -> party:", party._id.toString());
    console.log("CREATE -> movie:", movie._id.toString());

    // READ
    const readParty = await Party.findById(party._id);
    console.log("READ -> party name:", readParty.name);

    const moviesForParty = await MovieProposal.find({ partyId: party._id });
    console.log(
      "READ -> movies for party:",
      moviesForParty.map((m) => m.name)
    );

    // UPDATE
    readParty.location = "Updated CRUD Location";
    await readParty.save();
    console.log("UPDATE -> party location updated");

    const updatedMovie = await MovieProposal.findByIdAndUpdate(
      movie._id,
      { rating: "PG-13 (Updated)" },
      { new: true }
    );
    console.log("UPDATE -> movie rating:", updatedMovie.rating);

    // DELETE
    await MovieProposal.findByIdAndDelete(movie._id);
    console.log("DELETE -> movie removed");

    await Party.findByIdAndDelete(party._id);
    console.log("DELETE -> party removed");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("CRUD demo error:", err);
    process.exit(1);
  }
}

main();
