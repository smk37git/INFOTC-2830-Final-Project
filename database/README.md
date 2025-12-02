# MovieNight Database (MongoDB Atlas)

This folder contains the database design and sample data for the MovieNight web application.

## Database

- **DB name:** `movienight`
- **Hosted on:** MongoDB Atlas (connected from MongoDB Compass)

## Collections

1. `parties`
2. `movieProposals`
3. `movieVotes`
4. `timeProposals`
5. `timeVotes`

See [`schema.md`](schema.md) for detailed fields and relationships.

## How backend should connect

The backend should use an environment variable like:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/movienight
