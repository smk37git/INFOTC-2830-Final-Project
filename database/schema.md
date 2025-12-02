# MovieNight MongoDB Schema

## Collections and Fields

### 1. `parties`

Each watch party created by a host.

- `_id` (ObjectId) – primary key
- `name` (String) – party name
- `location` (String) – where the party will happen
- `deadlineToVote` (Date) – last date/time to vote
- `allowGuestProposals` (Boolean) – can guests propose movies/times
- `hostName` (String) – host's name
- `hostEmail` (String) – host's email
- `adminToken` (String) – token used to build the admin link
- `inviteToken` (String) – token used to build the invite link
- `status` (String) – e.g. `"OPEN"`, `"CLOSED"`, `"FINALIZED"`

---

### 2. `movieProposals`

Movies proposed for a specific party.

- `_id` (ObjectId)
- `partyId` (ObjectId → parties._id)
- `proposerName` (String)
- `proposerEmail` (String)
- `name` (String) – movie title
- `category` (String) – genre
- `rating` (String) – MPAA/IMDb rating
- `runtimeMinutes` (Number)
- `imdbLink` (String)
- `deleted` (Boolean) – for host delete feature

---

### 3. `movieVotes`

Votes on each movie proposal.

- `_id` (ObjectId)
- `partyId` (ObjectId → parties._id)
- `movieId` (ObjectId → movieProposals._id)
- `voterEmail` (String) – identify guest
- `value` (Number) – `+1` for upvote, `-1` for downvote`

Constraint (for backend): each `(movieId, voterEmail)` pair should be unique.

---

### 4. `timeProposals`

Date/time options proposed for a party.

- `_id` (ObjectId)
- `partyId` (ObjectId → parties._id)
- `proposerName` (String)
- `proposerEmail` (String)
- `startTime` (Date) – proposed watch time
- `deleted` (Boolean)

---

### 5. `timeVotes`

Votes on each proposed time option.

- `_id` (ObjectId)
- `partyId` (ObjectId → parties._id)
- `timeId` (ObjectId → timeProposals._id)
- `voterEmail` (String)
- `value` (Number) – `+1` or `-1`

---

## Relationships

- One **party** → many **movieProposals**
- One **party** → many **timeProposals**
- One **movieProposal** → many **movieVotes**
- One **timeProposal** → many **timeVotes**

These collections support the MovieNight core features:
- Creating a watch party
- Proposing movies and times
- Voting on movies and times
