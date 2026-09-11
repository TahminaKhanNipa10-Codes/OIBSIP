const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const dateDisplay = document.getElementById('date-display');

// Set Today's Date
const options = { weekday: 'long', month: 'short', day: 'numeric' };
dateDisplay.innerText = new Date().toLocaleDateString('en-US', options);

// Load Tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Format Date for Timestamp
function formatTime(dateObj) {
  return new Date(dateObj).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function renderTasks() {
  pendingList.innerHTML = '';
  completedList.innerHTML = '';
  
  let pCount = 0;
  let cCount = 0;

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item ' + (task.completed ? 'completed' : '');
    
    // Check if task is being edited
    let textHTML = '';
    if (task.isEditing) {
      textHTML = `<input type="text" class="edit-input" id="edit-input-${task.id}" value="${task.text}">`;
    } else {
      textHTML = `<span class="task-text">${task.text}</span>`;
    }

    // Timestamps formatting
    let timeText = `Added: ${formatTime(task.createdAt)}`;
    if (task.completed && task.completedAt) {
      timeText = `Completed: ${formatTime(task.completedAt)}`;
    }

    li.innerHTML = `
      <div class="task-main">
        <div class="check-circle" onclick="toggleTask(${task.id})">
          <i class="fas fa-check"></i>
        </div>
        <div class="task-details">
          ${textHTML}
          <span class="timestamp">${timeText}</span>
        </div>
      </div>
      <div class="action-btns">
        ${task.isEditing 
          ? `<button class="edit-btn" onclick="saveEdit(${task.id})"><i class="fas fa-save"></i></button>`
          : `<button class="edit-btn" onclick="enableEdit(${task.id})"><i class="fas fa-edit"></i></button>`
        }
        <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
      </div>
    `;

    // Append to correct list
    if (task.completed) {
      completedList.appendChild(li);
      cCount++;
    } else {
      pendingList.appendChild(li);
      pCount++;
    }
  });

  // Empty State Messages
  if (pCount === 0) {
    pendingList.innerHTML = '<li class="empty-msg">🎉 No pending tasks! You are all caught up.</li>';
  }
  if (cCount === 0) {
    completedList.innerHTML = '<li class="empty-msg">No completed tasks yet. Keep going!</li>';
  }

  // Update Counters
  pendingCount.innerText = `${pCount} pending`;
  completedCount.innerText = `${cCount} completed`;
  
  saveTasks();
}

function addTask() {
  const text = taskInput.value.trim();
  if (text !== '') {
    const newTask = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date(),
      completedAt: null,
      isEditing: false
    };
    tasks.push(newTask);
    taskInput.value = '';
    renderTasks();
  }
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if(task) {
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    task.isEditing = false; // Cancel edit if toggled
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
}

// Inline Edit Functions
function enableEdit(id) {
  const task = tasks.find(t => t.id === id);
  if(task && !task.completed) { // Optional: Prevent editing completed tasks
    task.isEditing = true;
    renderTasks();
    // Auto-focus the input
    setTimeout(() => {
      const input = document.getElementById(`edit-input-${id}`);
      if(input) input.focus();
    }, 50);
  }
}

function saveEdit(id) {
  const task = tasks.find(t => t.id === id);
  const input = document.getElementById(`edit-input-${id}`);
  if(task && input) {
    const newText = input.value.trim();
    if (newText !== '') {
      task.text = newText;
    }
    task.isEditing = false;
    renderTasks();
  }
}

// Event Listeners
addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Initial Render
renderTasks();