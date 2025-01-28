// Self-Care Pet JavaScript

// Import mood meter variable (assumed from variables.js or localStorage)
const moodMeter = localStorage.getItem('moodMeter') || 100;

// Daily tasks array
let dailyTasks = [];

// To-Do tasks array
let todos = [];

// Upcoming events array
let upcoming = [];

// Function to add a daily task
function addDailyTask(taskName) {
    dailyTasks.push({ name: taskName, completed: false });
    saveData();
}

// Function to toggle daily task completion
function toggleDailyTask(index) {
    dailyTasks[index].completed = !dailyTasks[index].completed;
    saveData();
}

// Function to reset daily tasks at midnight
function resetDailyTasks() {
    dailyTasks.forEach(task => task.completed = false);
    saveData();
}

// Function to add a to-do task
function addTodo(taskName, dueTime) {
    todos.push({ name: taskName, dueTime: new Date(dueTime), completed: false });
    saveData();
}

// Function to mark to-do as completed
function completeTodo(index) {
    todos.splice(index, 1); // Remove the completed task
    saveData();
}

// Function to add an upcoming event
function addUpcoming(name, dueTime, notes) {
    upcoming.push({ name, dueTime: new Date(dueTime), notes, completed: false });
    saveData();
}

// Function to mark upcoming as completed
function completeUpcoming(index) {
    upcoming.splice(index, 1); // Remove the completed event
    saveData();
}

// Function to update happiness
function updateHappiness() {
    let happiness = 100; // Reset happiness

    // Deduct happiness for uncompleted daily tasks
    dailyTasks.forEach(task => {
        if (!task.completed) happiness -= 10;
    });

    // Deduct happiness for overdue todos
    const now = new Date();
    todos.forEach(todo => {
        if (todo.dueTime < now) happiness -= 15;
    });

    // Limit happiness to 0-100
    happiness = Math.max(0, Math.min(100, happiness));

    // Save and update pet's image
    localStorage.setItem('moodMeter', happiness);
    updatePetImage(happiness);
}

// Function to update the pet image based on happiness
function updatePetImage(happiness) {
    const petImage = document.getElementById('pet-image');
    if (happiness > 70) {
        petImage.src = 'https://f2.toyhou.se/file/f2-toyhou-se/images/93570515_aeUz6esmw9w8vrc.png';
    } else if (happiness > 30) {
        petImage.src = 'https://f2.toyhou.se/file/f2-toyhou-se/images/93675353_mrafR2T3qBlD76x.gif';
    } else {
        petImage.src = 'https://f2.toyhou.se/file/f2-toyhou-se/images/93560941_r4Elyk48Wif4MTC.png';
    }
}

// Function to send desktop notifications
function sendNotification(title, body) {
    if (Notification.permission === 'granted') {
        new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body });
            }
        });
    }
}

// Function to check for notifications
function checkNotifications() {
    const now = new Date();

    // Check daily task notifications
    dailyTasks.forEach(task => {
        if (!task.completed && task.notifyTime && now >= new Date(task.notifyTime)) {
            sendNotification('Daily Task Reminder', `Don't forget to: ${task.name}`);
        }
    });

    // Check upcoming notifications
    upcoming.forEach(event => {
        if (!event.completed && event.dueTime && now >= new Date(event.dueTime)) {
            sendNotification('Upcoming Reminder', `Event: ${event.name}\nNotes: ${event.notes}`);
        }
    });
}

// Sort tasks by due time
function sortTasks() {
    todos.sort((a, b) => new Date(a.dueTime) - new Date(b.dueTime));
    upcoming.sort((a, b) => new Date(a.dueTime) - new Date(b.dueTime));
    saveData();
}

// Save all data to localStorage
function saveData() {
    localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('upcoming', JSON.stringify(upcoming));
}

// Load all data from localStorage
function loadData() {
    dailyTasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    upcoming = JSON.parse(localStorage.getItem('upcoming')) || [];
    updateHappiness();
    sortTasks();
}

// Initialize the app
function init() {
    loadData();
    setInterval(resetDailyTasks, 86400000); // Reset daily tasks at midnight
    setInterval(checkNotifications, 60000); // Check notifications every minute
}

init();
