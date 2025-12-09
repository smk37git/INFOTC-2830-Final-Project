# db-mongoose (MongoDB + Mongoose Part)

This folder contains the Mongoose code required by the rubric.

- `models/Party.js` and `models/MovieProposal.js` – two Mongoose models.
- `scripts/seed.js` – connects to MongoDB Atlas and inserts example Party + MovieProposal documents.
- `scripts/crudDemo.js` – demonstrates full CRUD (Create, Read, Update, Delete) for these models.

To run (locally):

```bash
cd db-mongoose
npm install
cp .env.example .env   # then edit .env and put your real MONGODB_URI
npm run seed           # seed data
npm run crud           # run CRUD demo
