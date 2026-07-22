// אלמנטים מה-DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// אירועים ראשים
document.addEventListener('DOMContentLoaded', loadAndRender);
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });
clearCompletedBtn.addEventListener('click', clearCompletedTasks);

// אירועי סינון
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    loadAndRender();
  });
});

// הוספת משימה
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return alert('נא להזין משימה!');

  const task = { id: Date.now(), text, completed: false };
  
  const tasks = getTasksFromStorage();
  tasks.push(task);
  saveTasksToStorage(tasks);

  taskInput.value = '';
  loadAndRender();
}

// טעינה ורינדור מחדש
function loadAndRender() {
  taskList.innerHTML = '';
  const tasks = getTasksFromStorage();

  // סינון המשימות לפי הפילטר הנבחר
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true; // 'all'
  });

  filteredTasks.forEach(renderTask);
  updateCounter(tasks);
}

// יצירת אלמנט משימה ב-DOM
function renderTask(task) {
  const li = document.createElement('li');
  if (task.completed) li.classList.add('completed');

  li.innerHTML = `
    <span class="task-text">${task.text}</span>
    <button class="delete-btn">🗑️</button>
  `;

  // שינוי סטטוס הושלם / לא הושלם
  li.querySelector('.task-text').addEventListener('click', () => {
    toggleTask(task.id);
  });

  // מחיקת משימה בודדת
  li.querySelector('.delete-btn').addEventListener('click', () => {
    deleteTask(task.id);
  });

  taskList.appendChild(li);
}

// עדכון מונה המשימות הפתוחות
function updateCounter(tasks) {
  const activeCount = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${activeCount} משימות נותרו`;
}

// === פונקציות עזר מול LocalStorage ===

function getTasksFromStorage() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}

function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTask(id) {
  const tasks = getTasksFromStorage().map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasksToStorage(tasks);
  loadAndRender();
}

function deleteTask(id) {
  const tasks = getTasksFromStorage().filter(t => t.id !== id);
  saveTasksToStorage(tasks);
  loadAndRender();
}

function clearCompletedTasks() {
  const tasks = getTasksFromStorage().filter(t => !t.completed);
  saveTasksToStorage(tasks);
  loadAndRender();
}

// ????? ????? ??? ????
const themeToggleBtn = document.getElementById('themeToggleBtn');

// ????? ??????? ?? ??? ???? (???? ????? ?????)
const SUN_EMOJI = '\u{1F31E}'; // ??
const MOON_EMOJI = '\u{1F319}'; // ??

// ????? ?-localStorage ?? ?????? ??? ??? ???? ???? ????
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggleBtn.textContent = SUN_EMOJI;
} else {
  themeToggleBtn.textContent = MOON_EMOJI;
}

// ????? ?????? ?? ????? ??? ????
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');

  // ????? ??????? ?????? ??????
  themeToggleBtn.textContent = isDark ? SUN_EMOJI : MOON_EMOJI;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});