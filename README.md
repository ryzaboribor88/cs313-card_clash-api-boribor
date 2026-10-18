# Card Clash API

Backend API for **Card Clash**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Ryza Micaela G. Boribor (ryza-boribor), BSCS 3-2
- Group and game concept: Group 2 Card Clash

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone https://github.com/ryzaboribor88/cs313-card_clash-api-boribor.git
cd cs313-card_clash-api-boribor
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | your_game_slug | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Purpose | Success |
|---|---|---|---|
| GET | /health | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | Finished games, every player, and the top 3. Needs the `X-Hub-Key` header. Optional `?since=` | 200 (401 without the key) |

## What "completed" means in my game

A player completed the game when the game ended (status CLOSED, `ended_at` filled in) and the player stayed in it until the end, so their status in that game is `completed`. A player who left before the timer ran out has the status `left` and did not complete the game, even if they already had points.

## Tables

| # | Table | What it stores |
|---|---|---|
| 1 | users | Accounts with a school ID, name, email and role (host or player) |
| 2 | question_sets | Sets of questions a host can pick for a game |
| 3 | questions | One question with its difficulty (green, yellow, red) |
| 4 | choices | The answer choices of a question, with the correct one marked |
| 5 | power_cards | The kinds of Power Cards (Point Steal, Double Points, Shield) |
| 6 | game_sessions | One game, with its 6-digit join code, mode, status and times |
| 7 | seat | One seat per account per game (UNIQUE on game and user_id), with nickname and score |
| 8 | players | A player's nickname, token and status inside a game |
| 9 | participants | The competing unit, a solo player or a team, with score, HP and revival count |
| 10 | participant_members | Which players belong to which participant |
| 11 | decks | The card path of a participant |
| 12 | question_cards | A question made into a card, with its team and solo points |
| 13 | cards | The cards in a deck, with colour, hidden type and position |
| 14 | participant_power_cards | Power Cards a participant saved in their inventory |
| 15 | answers | Every answer given, with points earned and HP change |
| 16 | aid_requests | A request from an eliminated participant to an active one |
| 17 | revivals | The result of an accepted aid request (cost and outcome) |
| 18 | comeback_challenges | The timed challenge after a revival |
| 19 | comeback_cards | The fixed-point cards used in a comeback challenge |
| 20 | game_results | The final score, HP and stats of each participant | 

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |
