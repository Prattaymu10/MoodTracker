
# 😊 Mood Tracker

A full-stack web application to track your emotions with emojis, visualize your 7-day mood trends, and discover patterns over time.

🌐 **Live Demo:** [Mood Tracker](https://mood-s5un.vercel.app/)

## ✨ Features

- 🔐 **Authentication** – Signup and login with bcrypt-hashed passwords and JWT authentication (1-day expiry).
- 🎭 **Emoji Mood Logging** – 11-point mood scale from `-5 😡` to `+5 🤗`, with optional notes.
- 🚦 **Daily Entry Limit** – Maximum 10 entries per user per day, enforced server-side.
- 📈 **7-Day Mood Trend** – Daily average mood visualization using Chart.js.
- 📊 **Insights Dashboard** – Average mood, total entries, streak, best day, and trend indicator.
- 🌙 **Modern UI** – Responsive dark glassmorphism interface with animations.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, Tailwind CSS (CDN), Vanilla JavaScript, Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Deployment | Vercel |

## 📁 Project Structure

```text
Mood-Tracker/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── moodController.js
│   └── models/
│       ├── User.js
│       └── Mood.js
└── frontend/
    ├── login.html
    ├── login.js
    ├── dashboard.html
    └── dashboard.js
```

## 🔌 API Endpoints

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| POST | `/api/moods` | Yes | Add a mood entry |
| GET | `/api/moods` | Yes | Retrieve recent moods and 7-day chart data |
| GET | `/api/moods/daily-count` | Yes | Get today's entry count and remaining limit |

**Authentication:** Protected routes require an authorization header:

```http
Authorization: Bearer <token>
```

## 🚀 Run Locally

**1. Clone the repository**

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Mood-Tracker
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Configure environment variables**

Create a `.env` file inside the backend directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

**4. Start the backend**

```bash
npm start
```

**5. Configure the frontend**

Set `API_BASE_URL` in `login.js` and `dashboard.js` to:

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

Open `frontend/login.html` in your browser to use the application.

## 🔮 Future Improvements

- Edit and delete mood entries.
- Weekly and monthly reports.
- Export mood history.
- Mood categories and journaling features.

## 👤 Author

**Prattay Rahan**  
CSE Graduate, Metropolitan University, Sylhet

