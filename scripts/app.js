// DOM Elements
const startBtn = document.getElementById('start-btn');
const mainContent = document.getElementById('main-content');
const introSection = document.getElementById('intro-section');
const addTaskBtn = document.getElementById('add-task-btn');
const addTaskSection = document.getElementById('add-task-section');
const closeNotificationBtn = document.getElementById('close-notification');
const taskForm = document.getElementById('task-form');
const taskData = JSON.parse(localStorage.getItem('tasks')) || {};

// Function to display the schedule
function updateTaskSchedule() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const tasksContainer = document.getElementById('tasks-container');
    tasksContainer.innerHTML = ''; // Clear previous tasks

    days.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.innerHTML = `<h3>${day}</h3>`;

        if (taskData[day]) {
            taskData[day].forEach((task, index) => {
                // Check if the task has expired
                if (new Date(task.time) < new Date()) {
                    taskData[day].splice(index, 1); // Remove expired task
                } else {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('task');
                    taskElement.innerHTML = `
                        <p>${task.time} - ${task.title}: ${task.description}</p>
                        <button class="delete-task-btn" onclick="deleteTask('${day}', ${index})">حذف المهمة</button>
                    `;
                    dayDiv.appendChild(taskElement);
                }
            });
        } else {
            dayDiv.innerHTML += `<p>لا توجد مهام لهذا اليوم</p>`;
        }

        tasksContainer.appendChild(dayDiv);
    });

    // Save the updated tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(taskData));
}

// Function to show the Add Task section
function showAddTaskSection() {
    addTaskSection.style.display = 'block';
}

// Function to handle form submission
function addNewTask(e) {
    e.preventDefault();
    const day = document.getElementById('task-day').value;
    const title = document.getElementById('task-title').value;
    const time = document.getElementById('task-time').value;
    const description = document.getElementById('task-description').value;

    if (!taskData[day]) taskData[day] = [];
    taskData[day].push({ title, time, description });

    localStorage.setItem('tasks', JSON.stringify(taskData));
    taskForm.reset();
    addTaskSection.style.display = 'none';
    updateTaskSchedule();
}

// Function to close the notification
function closeNotification() {
    document.getElementById('daily-notification').style.display = 'none';
}

// Function to delete a task
function deleteTask(day, index) {
    taskData[day].splice(index, 1); // Remove the task from the array
    localStorage.setItem('tasks', JSON.stringify(taskData)); // Save the updated tasks to localStorage
    updateTaskSchedule(); // Update the task schedule after deletion
}

// Function to delete all tasks on Sunday at 10:00 PM
function deleteAllTasksOnSunday() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 for Sunday
    const currentTime = now.getHours();

    // Check if today is Sunday and the time is 10:00 PM or later
    if (currentDay === 0 && currentTime >= 22) {
        taskData['Monday'] = []; // Clear all tasks for Monday
        taskData['Tuesday'] = [];
        taskData['Wednesday'] = [];
        taskData['Thursday'] = [];
        taskData['Friday'] = [];
        taskData['Saturday'] = [];
        taskData['Sunday'] = [];

        // Save the cleared tasks to localStorage
        localStorage.setItem('tasks', JSON.stringify(taskData));

        // Optionally update the task schedule
        updateTaskSchedule();
    }
}

// Check every minute to see if it is time to delete tasks on Sunday
setInterval(deleteAllTasksOnSunday, 60000); // 60000ms = 1 minute

// Event Listeners
startBtn.addEventListener('click', () => {
    introSection.style.display = 'none';
    mainContent.style.display = 'block';
    updateTaskSchedule();
});

addTaskBtn.addEventListener('click', showAddTaskSection);
taskForm.addEventListener('submit', addNewTask);
closeNotificationBtn.addEventListener('click', closeNotification);
