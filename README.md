# Recycling Platform

Web app that teaches people about recycling through quizzes, a points system, and tracking what you recycle. Built with Node.js, Express, and SQLite.

## What it does

- Sign up / log in (passwords hashed with bcrypt)
- Take recycling quizzes and compete on a leaderboard
- Log what materials you recycle (plastic, paper, glass, metal, electronics) and earn points
- Browse local recycling events
- Educational page about different materials and how to recycle them
- Admin panel for managing questions, events, and users

## Setup

You need [Node.js](https://nodejs.org/) 18+.

```bash
# install dependencies
npm install

# start the server
npm start
```

Then open http://localhost:3003 in your browser. The SQLite database (`reciclare.db`) gets created automatically on first run with some sample data.

## Project structure

```
├── server.js              # express server, entry point
├── src/
│   ├── db/
│   │   ├── index.js       # database init and query helper
│   │   └── schema.sql     # table definitions
│   ├── middleware/
│   │   └── errorHandler.js
│   └── routes/
│       ├── auth.js        # signup, login
│       ├── quiz.js        # questions, scores, leaderboard
│       ├── recycling.js   # log materials, stats
│       ├── events.js      # recycling events
│       ├── user.js        # profile
│       └── admin.js       # manage users/content
├── client/
│   ├── css/style.css
│   ├── js/                # client-side logic per page
│   └── *.html             # pages (index, quiz, login, etc.)
└── package.json
```

## API

All endpoints are under `/api/`:

- `POST /api/auth/signup` and `/api/auth/login` for auth
- `GET /api/quiz/questions` — get quiz questions
- `POST /api/quiz/score` — submit a score
- `GET /api/quiz/leaderboard` — top 10 users
- `POST /api/recycling/log` — log recycled material
- `GET /api/recycling/stats/:userId` — recycling stats
- `GET /api/events` — list events
- `GET /api/user/:userId` — user profile with total points

Admin routes (`/api/admin/`) let you manage users, questions, and events.

## Points system

Each material gives different points: plastic (5), paper (3), glass (4), metal (6), electronics (10). Total points = quiz scores + recycling points.

## Tech stack

Node.js, Express, sql.js (SQLite), bcryptjs, vanilla HTML/CSS/JS on the frontend.
