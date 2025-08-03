const express = require("express");
const router = express.Router();
const {
  addMood,
  getMoods,
  getDailyCount,
} = require("../controllers/moodController");
const verifyToken = require("../middleware/authMiddleware");

// POST /api/moods
router.post("/", verifyToken, addMood);

// GET /api/moods
router.get("/", verifyToken, getMoods);

// GET /api/moods/daily-count
router.get("/daily-count", verifyToken, getDailyCount);

module.exports = router;
