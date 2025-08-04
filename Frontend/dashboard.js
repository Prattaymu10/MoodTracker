// TAILWIND CONFIGURATION
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        slideInUp: "slideInUp 0.6s ease-out",
        slideInLeft: "slideInLeft 0.6s ease-out",
        slideInRight: "slideInRight 0.6s ease-out",
        fadeIn: "fadeIn 0.8s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "bounce-soft": "bounce-soft 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "scale-in": "scale-in 0.5s ease-out",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)" },
        },
        slideInUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
};


// GLOBAL VARIABLES

let moodChart = null; // Chart.js instance
const API_BASE_URL = "http://localhost:5000/api";


// AUTHENTICATION MANAGEMENT

/**
 * Check if user is authenticated and redirect to login if not
 * @returns {boolean} - Whether user is authenticated
 */
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

/**
 * Log out user and redirect to login page
 * Clears all stored user data
 */
function logout() {
  // Clear all stored data
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Show logout message briefly
  showNotification("Logged out successfully", "success");

  // Redirect to login after brief delay
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1000);
}


// MOOD UTILITIES

/**
 * Get emoji representation for mood score
 * @param {number} score - Mood score (-5 to +5)
 * @returns {string} - Corresponding emoji
 */
function getEmoji(score) {
  const emojiMap = {
    "-5": "😡", // Furious
    "-4": "😩", // Exhausted
    "-3": "😭", // Overwhelmed
    "-2": "😔", // Disappointed
    "-1": "😬", // Anxious
    0: "😐", // Neutral
    1: "😂", // Amused
    2: "😄", // Joyful
    3: "😎", // Confident
    4: "🤩", // Inspired
    5: "🤗", // Ecstatic
  };
  return emojiMap[score.toString()] || "😐";
}

/**
 * Get mood label for score
 * @param {number} score - Mood score (-5 to +5)
 * @returns {string} - Mood label
 */
function getMoodLabel(score) {
  const labelMap = {
    "-5": "Furious",
    "-4": "Exhausted",
    "-3": "Overwhelmed",
    "-2": "Disappointed",
    "-1": "Anxious",
    0: "Neutral",
    1: "Amused",
    2: "Joyful",
    3: "Confident",
    4: "Inspired",
    5: "Ecstatic",
  };
  return labelMap[score.toString()] || "Unknown";
}

// TIP SYSTEM

const tips = [
  "Take 10 deep breaths and feel your body relax with each exhale.",
  "Drink a full glass of water and notice how refreshed you feel.",
  "Step outside for 5 minutes and soak in some natural light.",
  "Write down 3 specific things you're grateful for right now.",
  "Do 10 jumping jacks or stretch your arms above your head.",
  "Tidy up a small area around you for an instant mood boost.",
  "Listen to your favorite uplifting song and let yourself dance.",
  "Call or text someone you care about just to say hello.",
  "Look in the mirror and give yourself a genuine compliment.",
  "Take a moment to notice something beautiful in your surroundings.",
  "Practice the 5-4-3-2-1 grounding technique with your senses.",
  "Smile for 30 seconds - your brain will think you're happier!",
  "Do something kind for someone else, even if it's small.",
  "Spend 2 minutes focusing only on your breathing.",
  "Read an inspiring quote or watch a motivational video.",
];


//Update the tip of the day with a random wellness tip

function updateTip() {
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  const tipElement = document.getElementById("tipText");
  if (tipElement) {
    tipElement.textContent = randomTip;
  }
}


// DATE & TIME MANAGEMENT

/**
 * Update the current date and time display
 * Called every minute to keep time current
 */
function updateDateTime() {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateElement = document.getElementById("currentDate");
  if (dateElement) {
    dateElement.innerHTML = `
      <span class="inline-flex items-center">
        <span class="mr-2">📅</span>
        ${formattedDate} • ${formattedTime}
      </span>
    `;
  }
}


// DAILY COUNT MANAGEMENT

/**
 * Fetch and display daily mood entry count
 * Shows progress toward daily goal (10 entries max)
 */
async function fetchDailyCount() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE_URL}/moods/daily-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const counterText = document.getElementById("counterText");
    const saveMoodBtn = document.getElementById("saveMoodBtn");

    if (!counterText || !saveMoodBtn) return;

    if (data.success) {
      if (data.remaining <= 0) {
        // Daily limit reached
        counterText.innerHTML = `
          <div class="flex items-center">
            <span class="text-2xl mr-3">🎯</span>
            <div>
              <div class="font-bold">Daily limit reached!</div>
              <div class="text-sm opacity-80">You've logged <strong>${data.todayCount}/10</strong> moods today. Great job!</div>
            </div>
          </div>
        `;
        counterText.parentElement.className =
          "mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-200 backdrop-blur-md animate-scale-in";

        // Disable save button
        saveMoodBtn.disabled = true;
        saveMoodBtn.innerHTML = `
          <span class="relative z-10 flex items-center justify-center">
            <span class="mr-2">✅</span>
            Daily Goal Complete!
          </span>
        `;
      } else {
        // Show progress
        counterText.innerHTML = `
          <div class="flex items-center">
            <span class="text-2xl mr-3">📊</span>
            <div>
              <div class="font-bold">Today's Progress: <span class="text-blue-300">${data.todayCount}/10</span></div>
              <div class="text-sm opacity-80">${data.remaining} entries remaining</div>
            </div>
          </div>
        `;
        counterText.parentElement.className =
          "mb-6 p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30 text-blue-200 backdrop-blur-md animate-scale-in";

        // Enable save button
        saveMoodBtn.disabled = false;
      }
    }
  } catch (error) {
    console.error("Failed to fetch daily count:", error);
    showNotification("Failed to load daily progress", "error");
  }
}


// MOOD SAVING

/**
 * Save a new mood entry
 * Includes validation, loading states, and user feedback
 */
async function saveMood() {
  const token = localStorage.getItem("token");
  const moodValue = document.getElementById("mood").value;
  const note = document.getElementById("note").value;
  const moodScore = parseInt(moodValue);
  const moodEmoji = getEmoji(moodScore);

  if (!token) {
    showNotification("Please log in to save your mood.", "error");
    return;
  }

  // Validate input
  if (isNaN(moodScore)) {
    showNotification("Please select a mood level.", "error");
    return;
  }

  // Add loading state
  const saveBtn = document.getElementById("saveMoodBtn");
  if (!saveBtn) return;

  const originalContent = saveBtn.innerHTML;
  saveBtn.innerHTML = `
    <span class="relative z-10 flex items-center justify-center">
      <span class="animate-spin mr-2">⭐</span>
      Saving...
    </span>
  `;
  saveBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/moods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mood: moodEmoji,
        moodScore,
        note: note.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // Success animation
      saveBtn.style.animation = "glow 0.6s ease-out";
      saveBtn.innerHTML = `
        <span class="relative z-10 flex items-center justify-center">
          <span class="mr-2">✅</span>
          Saved Successfully!
        </span>
      `;

      // Show success message
      const remainingText =
        data.remainingToday !== undefined
          ? `${data.remainingToday} entries remaining today.`
          : "Mood saved successfully!";
      showNotification(`Mood saved! ${remainingText}`, "success");

      // Clear form
      document.getElementById("note").value = "";

      // Refresh data
      await Promise.all([fetchMoods(), fetchDailyCount()]);

      // Reset button after delay
      setTimeout(() => {
        saveBtn.innerHTML = originalContent;
        saveBtn.disabled = false;
        saveBtn.style.animation = "";
      }, 2000);
    } else {
      throw new Error(data.message || "Failed to save mood");
    }
  } catch (error) {
    console.error("Save mood error:", error);
    showNotification("Failed to save mood. Please try again.", "error");
    saveBtn.innerHTML = originalContent;
    saveBtn.disabled = false;
  }
}


// NOTIFICATION SYSTEM

/**
 * Display notification messages with animations
 * @param {string} message - Message to display
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  const bgColor = {
    success: "bg-green-500/20 border-green-500/30 text-green-200",
    error: "bg-red-500/20 border-red-500/30 text-red-200",
    info: "bg-blue-500/20 border-blue-500/30 text-blue-200",
  };

  notification.className = `fixed top-6 right-6 z-50 p-4 rounded-2xl backdrop-blur-xl border ${bgColor[type]} shadow-2xl animate-slideInRight max-w-sm`;
  notification.innerHTML = `
    <div class="flex items-start space-x-3">
      <span class="text-xl">${
        type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"
      }</span>
      <p class="flex-1">${message}</p>
      <button onclick="this.parentElement.parentElement.remove()" class="text-gray-400 hover:text-white">×</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove notification
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideInRight 0.3s ease-out reverse";
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}


// MOOD DATA FETCHING

async function fetchMoods() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch(`${API_BASE_URL}/moods`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.moods)) {
      updateMoodTable(data.moods);
      updateMoodStats(data.moods);
      drawChart(data.moods);
    } else {
      console.error("Invalid mood data received:", data);
      showNotification("Failed to load mood data", "error");
    }
  } catch (error) {
    console.error("Fetch moods error:", error);
    showNotification("Failed to connect to server", "error");
  }
}


// MOOD TABLE RENDERING

/**
 * Update the mood entries table
 * @param {Array} moods - Array of mood entries
 */
function updateMoodTable(moods) {
  const tableBody = document.getElementById("moodTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (moods.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="p-8 text-center text-gray-400">
          <div class="text-4xl mb-2">📊</div>
          <div>No mood entries yet. Start tracking your mood today!</div>
        </td>
      </tr>
    `;
    return;
  }

  // Show latest 10 entries
  moods.slice(0, 10).forEach((entry, index) => {
    const date = new Date(entry.date);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const row = document.createElement("tr");
    row.className =
      "hover:bg-white/5 transition-colors duration-300 animate-fadeIn";
    row.style.animationDelay = `${index * 0.1}s`;
    row.innerHTML = `
      <td class="p-4">
        <div class="font-medium">${formattedDate}</div>
        <div class="text-sm text-gray-400">${formattedTime}</div>
      </td>
      <td class="p-4">
        <span class="text-3xl">${getEmoji(entry.moodScore)}</span>
        <div class="text-sm text-gray-400">${getMoodLabel(entry.moodScore)} (${
      entry.moodScore > 0 ? "+" : ""
    }${entry.moodScore})</div>
      </td>
      <td class="p-4 max-w-xs">
        <div class="truncate" title="${entry.note || ""}">${
      entry.note || "—"
    }</div>
      </td>
      <td class="p-4">
        <button onclick="viewMoodDetails('${
          entry._id || entry.id || index
        }')" class="text-blue-400 hover:text-blue-300 text-sm underline transition-colors">
          View
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

/**
 * View detailed information about a specific mood entry
 * @param {string} entryId - ID of the mood entry
 */
function viewMoodDetails(entryId) {
  showNotification("Mood details feature coming soon!", "info");
}


// MOOD STATISTICS

/**
 * Update mood statistics and insights
 * @param {Array} moods - Array of mood entries
 */
function updateMoodStats(moods) {
  // Initialize default values
  const stats = {
    avgMood: "--",
    totalEntries: "0",
    streakCount: "0 days",
    bestMoodDay: "No data",
    trendIndicator: "Stable",
    trendClass: "text-2xl font-bold text-blue-300",
  };

  if (moods.length === 0) {
    updateStatsElements(stats);
    return;
  }

  // Calculate average mood
  const avgMood = (
    moods.reduce((sum, entry) => sum + entry.moodScore, 0) / moods.length
  ).toFixed(1);
  stats.avgMood = avgMood > 0 ? `+${avgMood}` : avgMood;

  // Total entries
  stats.totalEntries = moods.length.toString();

  // Calculate streak (consecutive days with entries)
  stats.streakCount = calculateStreak(moods);

  // Find best mood day this week
  stats.bestMoodDay = findBestMoodDay(moods);

  // Calculate trend
  const trendData = calculateTrend(moods);
  stats.trendIndicator = trendData.indicator;
  stats.trendClass = trendData.className;

  updateStatsElements(stats);
}

/**
 * Update DOM elements with calculated statistics
 * @param {Object} stats - Statistics object
 */
function updateStatsElements(stats) {
  const elements = {
    avgMood: document.getElementById("avgMood"),
    totalEntries: document.getElementById("totalEntries"),
    streakCount: document.getElementById("streakCount"),
    bestMoodDay: document.getElementById("bestMoodDay"),
    trendIndicator: document.getElementById("trendIndicator"),
  };

  if (elements.avgMood) elements.avgMood.textContent = stats.avgMood;
  if (elements.totalEntries)
    elements.totalEntries.textContent = stats.totalEntries;
  if (elements.streakCount)
    elements.streakCount.textContent = stats.streakCount;
  if (elements.bestMoodDay)
    elements.bestMoodDay.textContent = stats.bestMoodDay;
  if (elements.trendIndicator) {
    elements.trendIndicator.textContent = stats.trendIndicator;
    elements.trendIndicator.className = stats.trendClass;
  }
}

/**
 * Calculate consecutive days streak
 * @param {Array} moods - Array of mood entries
 * @returns {string} - Streak count with "days" suffix
 */
function calculateStreak(moods) {
  const today = new Date();
  let streak = 0;

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);

    const hasEntry = moods.some((mood) => {
      const moodDate = new Date(mood.date);
      return moodDate.toDateString() === checkDate.toDateString();
    });

    if (hasEntry) {
      streak++;
    } else if (i > 0) {
      break; // Break streak if no entry found (except for today)
    }
  }

  return `${streak} days`;
}

/**
 * Find the best mood day in the current week
 * @param {Array} moods - Array of mood entries
 * @returns {string} - Best day formatted string
 */
function findBestMoodDay(moods) {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  const thisWeekMoods = moods.filter((mood) => new Date(mood.date) >= weekAgo);

  if (thisWeekMoods.length === 0) return "No data";

  // Group moods by day and calculate average for each day
  const groupedByDay = {};
  thisWeekMoods.forEach((mood) => {
    const dateKey = new Date(mood.date).toDateString();
    if (!groupedByDay[dateKey]) {
      groupedByDay[dateKey] = [];
    }
    groupedByDay[dateKey].push(mood.moodScore);
  });

  let bestDay = "";
  let highestAvg = -Infinity;

  Object.entries(groupedByDay).forEach(([day, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg > highestAvg) {
      highestAvg = avg;
      bestDay = new Date(day).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  });

  return bestDay || "No data";
}

/**
 * Calculate mood trend comparing recent vs older entries
 * @param {Array} moods - Array of mood entries
 * @returns {Object} - Trend indicator and CSS class
 */
function calculateTrend(moods) {
  if (moods.length < 7) {
    return {
      indicator: "Stable",
      className: "text-2xl font-bold text-blue-300",
    };
  }

  const recentMoods = moods.slice(0, 7);
  const olderMoods = moods.slice(7, 14);

  if (olderMoods.length === 0) {
    return {
      indicator: "Stable",
      className: "text-2xl font-bold text-blue-300",
    };
  }

  const recentAvg =
    recentMoods.reduce((sum, m) => sum + m.moodScore, 0) / recentMoods.length;
  const olderAvg =
    olderMoods.reduce((sum, m) => sum + m.moodScore, 0) / olderMoods.length;
  const trend = recentAvg - olderAvg;

  if (trend > 0.5) {
    return {
      indicator: "Improving",
      className: "text-2xl font-bold text-green-300",
    };
  } else if (trend < -0.5) {
    return {
      indicator: "Declining",
      className: "text-2xl font-bold text-red-300",
    };
  } else {
    return {
      indicator: "Stable",
      className: "text-2xl font-bold text-blue-300",
    };
  }
}


// CHART RENDERING

/**
 * Draw mood chart using Chart.js
 * @param {Array} moods - Array of mood entries
 */
function drawChart(moods) {
  const canvas = document.getElementById("moodChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Destroy existing chart
  if (moodChart) {
    moodChart.destroy();
    moodChart = null;
  }

  if (moods.length === 0) {
    // Show empty state
    ctx.fillStyle = "#6B7280";
    ctx.font = "16px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("No data to display", canvas.width / 2, canvas.height / 2);
    return;
  }

  // Prepare data for last 7 days
  const last7Days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    last7Days.push(date);
  }

  const chartData = last7Days.map((date) => {
    const dayMoods = moods.filter((mood) => {
      const moodDate = new Date(mood.date);
      return moodDate.toDateString() === date.toDateString();
    });

    if (dayMoods.length === 0) return null;

    const avgMood =
      dayMoods.reduce((sum, mood) => sum + mood.moodScore, 0) / dayMoods.length;
    return Math.round(avgMood * 10) / 10; // Round to 1 decimal place
  });

  const labels = last7Days.map((date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  );

  // Create chart
  moodChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Average Mood",
          data: chartData,
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "rgb(255, 255, 255)",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          spanGaps: true, // Connect points even with null values
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "rgba(59, 130, 246, 0.5)",
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              const value = context.parsed.y;
              if (value === null) return "No data";
              return `Mood: ${value > 0 ? "+" : ""}${value}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          min: -5,
          max: 5,
          ticks: {
            color: "rgb(156, 163, 175)",
            callback: function (value) {
              return value > 0 ? `+${value}` : value;
            },
            stepSize: 1,
          },
          grid: {
            color: "rgba(156, 163, 175, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "rgb(156, 163, 175)",
          },
          grid: {
            color: "rgba(156, 163, 175, 0.1)",
          },
        },
      },
      elements: {
        point: {
          hoverBorderWidth: 3,
        },
      },
    },
  });
}


// INITIALIZATION

/**
 * Initialize the dashboard when DOM is loaded
 * Sets up all components and loads initial data
 */
function initDashboard() {
  // Check authentication first
  if (!checkAuth()) {
    return;
  }

  // Initialize UI components
  updateTip();
  updateDateTime();

  // Set up periodic updates
  setInterval(updateDateTime, 60000); // Update time every minute

  // Load initial data
  fetchDailyCount();
  fetchMoods();

  console.log("Dashboard initialized successfully");
}

// Start the dashboard when DOM is ready
document.addEventListener("DOMContentLoaded", initDashboard);
