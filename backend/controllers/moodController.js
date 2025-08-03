const Mood = require("../models/Mood");

exports.addMood = async (req, res) => {
  const { mood, moodScore, note } = req.body;
  try {
    // Check daily limit (10 moods per day)
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const todayMoodCount = await Mood.countDocuments({
      user: req.user.id,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (todayMoodCount >= 10) {
      return res.status(400).json({
        success: false,
        message: "Daily mood limit reached (10 moods per day)",
      });
    }

    const moodEntry = new Mood({
      user: req.user.id,
      mood,
      moodScore,
      note,
    });

    await moodEntry.save();
    res.status(201).json({
      success: true,
      mood: moodEntry,
      remainingToday: 10 - (todayMoodCount + 1),
    });
  } catch (err) {
    console.error("Add mood error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getMoods = async (req, res) => {
  try {
    // Get last 10 moods for recent entries
    const recentMoods = await Mood.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(10);

    // Get last 7 days data for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const chartData = await Mood.find({
      user: req.user.id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: 1 });

    // Group by day and calculate average mood for each day
    const dailyAverages = {};
    chartData.forEach((mood) => {
      const day = mood.date.toDateString();
      if (!dailyAverages[day]) {
        dailyAverages[day] = { total: 0, count: 0 };
      }
      dailyAverages[day].total += mood.moodScore;
      dailyAverages[day].count += 1;
    });

    // Create 7-day chart data
    const chartLabels = [];
    const chartValues = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayString = date.toDateString();
      const shortDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      chartLabels.push(shortDate);

      if (dailyAverages[dayString]) {
        const avg =
          dailyAverages[dayString].total / dailyAverages[dayString].count;
        chartValues.push(Math.round(avg * 10) / 10); // Round to 1 decimal
      } else {
        chartValues.push(null); // No data for this day
      }
    }

    res.json({
      success: true,
      moods: recentMoods,
      chartData: {
        labels: chartLabels,
        values: chartValues,
      },
    });
  } catch (err) {
    console.error("Get moods error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getDailyCount = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const count = await Mood.countDocuments({
      user: req.user.id,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    res.json({
      success: true,
      todayCount: count,
      remaining: 10 - count,
    });
  } catch (err) {
    console.error("Get daily count error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
