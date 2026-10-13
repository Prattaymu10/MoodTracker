# 😊 Mood Tracker

A full-stack web app to log your emotions with emojis, see your 7-day mood trend, and spot patterns over time.

## ✨ Features

- 🔐 **Auth** – Signup/login with bcrypt-hashed passwords and JWT (1-day expiry)
- 🎭 **Emoji mood logging** – 11-point scale from `-5 😡` to `+5 🤗`, with an optional note
- 🚦 **Daily limit** – Max 10 entries per user per day, enforced server-side
- 📈 **7-day trend chart** – Daily average mood rendered with Chart.js
- 📊 **Insights** – Average mood, total entries, streak, best day, and trend indicator
- 🌙 **Dark glassmorphism UI** – Responsive, animated, built with Tailwind CSS

## 🛠 Tech Stack

| Layer    | Tech                                           |
| -------- | ---------------------------------------------- |
| Frontend | HTML, Tailwind CSS (CDN), Vanilla JS, Chart.js |
| Backend  | Node.js, Express                               |
| Database | MongoDB + Mongoose                             |
| Auth     | JWT, bcryptjs                                  |
| Hosting  | Render (backend)                               |

## 📁 Structure

```
├── backend
│   ├── controllers/   authController.js, moodController.js
│   └── models/        User.js, Mood.js
└── frontend
    ├── login.html / login.js
    └── dashboard.html / dashboard.js
```

## 🔌 API Endpoints

| Method | Endpoint                | Auth | Description                          |
| ------ | ----------------------- | ---- | ------------------------------------ |
| POST   | `/api/auth/signup`      | ❌   | Register a new user                  |
| POST   | `/api/auth/login`       | ❌   | Login, returns JWT                   |
| POST   | `/api/moods`            | ✅   | Add a mood entry                     |
| GET    | `/api/moods`            | ✅   | Last 10 moods + 7-day chart data     |
| GET    | `/api/moods/daily-count`| ✅   | Today's entry count and remaining    |

Protected routes expect `Authorization: Bearer <token>`.

## 🚀 Run Locally

```bash
# Backend
cd backend
npm install
# create .env with:
# MONGO_URI=your_mongodb_uri
# JWT_SECRET=your_secret
# PORT=5000
npm start
```

Then set `API_BASE_URL` in `login.js` and `dashboard.js` to `http://localhost:5000/api`, and open `frontend/login.html` in your browser.

## 🔮 Future Ideas

- Edit/delete entries
- Weekly/monthly reports and export
- Mood tags and journaling

## 👤 Author

**Prattay** – CSE graduate, Metropolitan University, Sylhet

