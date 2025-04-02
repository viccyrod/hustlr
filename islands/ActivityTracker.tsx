import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import confetti from "https://esm.sh/canvas-confetti@1.9.2";

interface ActivityEntry {
  timestamp: string;
  type: string;
}

interface Activity {
  name: string;
  count: number;
  entries: ActivityEntry[];
}

const ACHIEVEMENTS: Record<number, string> = {
  5: "🌟 High Five!",
  10: "🔥 On Fire!",
  15: "⚡ Unstoppable!",
  20: "🚀 Rocket Mode!",
  25: "🌈 Legendary!",
  30: "👑 Champion!",
  50: "🌟 Superstar!",
  100: "🏆 Hall of Fame!"
} as const;

export default function ActivityTracker() {
  const activities = ["Email", "Call", "DM", "Meeting"];
  const [achievement, setAchievement] = useState<string | null>(null);
  const [stats, setStats] = useState<Activity[]>(() => {
    try {
      const today = new Date().toLocaleDateString();
      const savedStats = globalThis.localStorage?.getItem(`stats_${today}`);
      if (savedStats) {
        return JSON.parse(savedStats);
      }
    } catch (e) {
      console.error('Error loading stats:', e);
    }
    return activities.map((name) => ({ 
      name, 
      count: 0,
      entries: []
    }));
  });

  useEffect(() => {
    try {
      const today = new Date().toLocaleDateString();
      globalThis.localStorage?.setItem(`stats_${today}`, JSON.stringify(stats));
    } catch (e) {
      console.error('Error saving stats:', e);
    }
  }, [stats]);

  // Clear achievement message after 2 seconds
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => setAchievement(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const celebrateAchievement = (count: number) => {
    // Check for achievements
    const achievementLevel = Object.keys(ACHIEVEMENTS)
      .map(Number)
      .find(level => count === level);

    if (achievementLevel) {
      setAchievement(ACHIEVEMENTS[achievementLevel]);
      
      // Trigger special confetti effects based on level
      if (achievementLevel >= 50) {
        // Epic celebration
        confetti({
          particleCount: 150,
          spread: 180,
          origin: { y: 0.6 }
        });
      } else if (achievementLevel >= 25) {
        // Medium celebration
        confetti({
          particleCount: 100,
          spread: 120,
          origin: { y: 0.6 }
        });
      } else {
        // Regular celebration
        confetti({
          particleCount: 50,
          spread: 90,
          origin: { y: 0.6 }
        });
      }
    } else {
      // Small pop for regular increments
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.6 }
      });
    }
  };

  const addActivity = (index: number) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    
    setStats((prev) => {
      const newStats = [...prev];
      const newCount = newStats[index].count + 1;
      const updatedActivity = {
        ...newStats[index],
        count: newCount,
        entries: [
          ...newStats[index].entries,
          {
            timestamp: timeStr,
            type: newStats[index].name
          }
        ]
      };
      newStats[index] = updatedActivity;
      
      // Celebrate after updating the count
      celebrateAchievement(newCount);
      
      return newStats;
    });
  };

  const resetActivities = () => {
    if (confirm("Are you sure you want to reset all counters? This cannot be undone!")) {
      setStats(activities.map((name) => ({ 
        name, 
        count: 0,
        entries: []
      })));
      // Show a toast message
      setAchievement("🔄 All counters reset!");
    }
  };

  const totalCount = stats.reduce((sum, activity) => sum + activity.count, 0);
  const allEntries = stats
    .flatMap(activity => activity.entries)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div class="space-y-8 max-w-6xl mx-auto px-4">
      {/* Achievement Toast */}
      {achievement && (
        <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg text-xl font-bold transform transition-all duration-300 animate-bounce">
          {achievement}
        </div>
      )}

      {/* Reset Button - Positioned in Header */}
      <button
        onClick={resetActivities}
        class="fixed top-6 right-6 p-2 text-blue-100 hover:text-white rounded-full hover:bg-blue-500/20 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-blue-600 transform hover:scale-105 active:scale-95"
        title="Reset all counters"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      
      {/* Summary Section */}
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">Daily Summary</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg md:col-span-2">
            <p class="text-lg font-semibold">Total Activities</p>
            <p class="text-4xl font-bold text-blue-600">{totalCount}</p>
          </div>
          {stats.map(activity => (
            <div 
              key={`summary-${activity.name}`} 
              class={activity.name === "Meeting" ? 
                "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm p-4 rounded-lg border border-purple-200/30 shadow-inner" :
                "bg-gray-50 p-4 rounded-lg"
              }
            >
              <p class={`text-lg font-semibold ${activity.name === "Meeting" ? "bg-gradient-to-r from-purple-600 to-orange-600 inline-block text-transparent bg-clip-text" : ""}`}>
                {activity.name}
              </p>
              <p class={`text-2xl font-bold ${activity.name === "Meeting" ? "text-purple-700" : "text-gray-700"}`}>
                {activity.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Cards */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((activity, index) => (
          <div
            key={activity.name}
            class={`p-6 rounded-lg shadow-md text-center transform transition-all duration-150 hover:scale-105 ${
              activity.name === "Meeting" 
                ? "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm border border-purple-200/30" 
                : "bg-white"
            }`}
          >
            <h2 class={`text-2xl font-bold mb-3 ${
              activity.name === "Meeting" 
                ? "bg-gradient-to-r from-purple-600 to-orange-600 inline-block text-transparent bg-clip-text" 
                : ""
            }`}>
              {activity.name}
            </h2>
            <p class={`text-5xl font-bold mb-6 ${
              activity.name === "Meeting" 
                ? "text-purple-700" 
                : "text-gray-700"
            }`}>
              {activity.count}
            </p>
            <button
              onClick={() => addActivity(index)}
              class={`w-16 h-16 rounded-full text-white text-3xl font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-110 active:scale-95 ${
                activity.name === "Meeting"
                  ? "bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 focus:ring-purple-400 shadow-lg shadow-purple-500/30"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-400"
              }`}
            >
              +
            </button>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold mb-4">Today's Activity Log</h2>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          {allEntries.map((entry, index) => (
            <div key={index} class="flex items-center space-x-4 p-2 bg-gray-50 rounded">
              <span class="text-gray-500">{entry.timestamp}</span>
              <span class="font-medium">{entry.type}</span>
            </div>
          ))}
          {allEntries.length === 0 && (
            <p class="text-gray-500 italic">No activities recorded yet today</p>
          )}
        </div>
      </div>
    </div>
  );
} 