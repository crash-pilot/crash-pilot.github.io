// Variables.js

// Initialize or retrieve moodMeter from localStorage
let moodMeter = localStorage.getItem('moodMeter') || 100;

// Save moodMeter back to localStorage
function updateMoodMeter(value) {
    moodMeter = Math.max(0, Math.min(100, value)); // Ensure it's between 0-100
    localStorage.setItem('moodMeter', moodMeter);
}

export { moodMeter, updateMoodMeter };
