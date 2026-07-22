// ==========================================
// 1. בחירת אלמנטים מה-HTML
// ==========================================
const clockElement = document.getElementById('digital-clock');
const dateElement = document.getElementById('date-display');
const weatherInfoElement = document.getElementById('weather-info');
const citySelect = document.getElementById('city-select');
const themeToggleBtn = document.getElementById('theme-toggle');

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// אובייקט עם המיקומים הגאוגרפיים של הערים
const cities = {
    'tel-aviv': { lat: 32.0853, lon: 34.7818, name: 'תל אביב' },
    'jerusalem': { lat: 31.7683, lon: 35.2137, name: 'ירושלים' },
    'haifa': { lat: 32.7940, lon: 34.9896, name: 'חיפה' },
    'eilat': { lat: 29.5577, lon: 34.9519, name: 'אילת' }
};

// ==========================================
// 2. ניהול משימות (מערך ו-LocalStorage)
// ==========================================

let todos = JSON.parse(localStorage.getItem('my-dashboard-todos')) || [];

function saveToLocalStorage() {
    localStorage.setItem('my-dashboard-todos', JSON.stringify(todos));
}

function addTodo(taskText) {
    const newTodo = {
        id: Date.now(),
        text: taskText,
        completed: false
    };
    todos.push(newTodo);
    saveToLocalStorage();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveToLocalStorage();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveToLocalStorage();
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach(function(todo) {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const span = document.createElement('span');
        span.textContent = todo.text;
        span.style.cursor = 'pointer';

        if (todo.completed) {
            span.style.textDecoration = 'line-through';
            span.style.opacity = '0.6';
        }

        span.addEventListener('click', function() {
            toggleTodo(todo.id);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'מחק';
        deleteBtn.className = 'delete-btn';
        
        deleteBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // מונע סימון המשימה כבוצעה בעת מחיקה
            deleteTodo(todo.id);
        });

        li.appendChild(span);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

// האזנה להוספת משימה
todoForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskText = todoInput.value.trim();
    if (taskText === '') return;
    addTodo(taskText);
    todoInput.value = '';
    todoInput.focus();
});

// ==========================================
// 3. לוגיקת השעון והתאריך
// ==========================================
function updateClock() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    if (clockElement) {
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    if (dateElement) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('he-IL', options);
    }
}

// ==========================================
// 4. תקשורת עם API מזג האוויר
// ==========================================
async function fetchWeather() {
    try {
        if (!weatherInfoElement || !citySelect) return;
        
        weatherInfoElement.innerHTML = '<p>טוען נתונים...</p>';

        const selectedCityKey = citySelect.value;
        const cityData = cities[selectedCityKey];

        // שמירה ב-LocalStorage
        localStorage.setItem('my-dashboard-city', selectedCityKey);

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityData.lat}&longitude=${cityData.lon}&current=temperature_2m,weather_code`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('שגיאה בקבלת נתונים');
        }

        const data = await response.json();
        const temp = Math.round(data.current.temperature_2m);
        const weatherCode = data.current.weather_code;
        const weatherDescription = getWeatherDescription(weatherCode);

        weatherInfoElement.innerHTML = `
            <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 5px;">
                ${temp}°C
            </div>
            <p style="font-size: 1.1rem; margin: 0;">
                ${weatherDescription.icon} ${weatherDescription.text}
            </p>
            <p style="font-size: 0.8rem; opacity: 0.7; margin-top: 5px;">מזג אוויר ב${cityData.name}</p>
        `;

    } catch (error) {
        console.error('שגיאה בטעינת מזג האוויר:', error);
        if (weatherInfoElement) {
            weatherInfoElement.innerHTML = '⚠️ שגיאה בטעינת הנתונים';
        }
    }
}

function getWeatherDescription(code) {
    if (code === 0) return { text: 'בהיר לחלוטין', icon: '☀️' };
    if (code >= 1 && code <= 3) return { text: 'מעונן חלקית', icon: '⛅' };
    if (code >= 45 && code <= 48) return { text: 'ערפילי', icon: '🌫️' };
    if (code >= 51 && code <= 67) return { text: 'גשם קל', icon: '🌧️' };
    if (code >= 80 && code <= 82) return { text: 'גשם חזק', icon: '⛈️' };
    return { text: 'מזג אוויר משתנה', icon: '☁️' };
}

if (citySelect) {
    citySelect.addEventListener('change', fetchWeather);
}

// ==========================================
// 5. ניהול מצב כהה / בהיר (Dark Mode)
// ==========================================
const savedTheme = localStorage.getItem('my-dashboard-theme') || 'light';

function updateThemeButton(isDark) {
    if (themeToggleBtn) {
        themeToggleBtn.textContent = isDark ? '☀️ מצב בהיר' : '🌙 מצב כהה';
    }
}

// החלת ערכת הנושא השמורה
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeButton(true);
} else {
    document.body.classList.remove('dark-mode');
    updateThemeButton(false);
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
        const isDarkModeNow = document.body.classList.toggle('dark-mode');
        localStorage.setItem('my-dashboard-theme', isDarkModeNow ? 'dark' : 'light');
        updateThemeButton(isDarkModeNow);
    });
}

// ==========================================
// 6. הפעלה וריצה ראשונית של האפליקציה
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    // מציג משימות מה-LocalStorage
    renderTodos();        

    // מפעיל את השעון ומעדכן אותו בכל שנייה
    updateClock();        
    setInterval(updateClock, 1000); 

    // טוען את העיר המועדפת האחרונה ומפעיל את ה-API
    const savedCity = localStorage.getItem('my-dashboard-city') || 'tel-aviv';
    if (citySelect) {
        citySelect.value = savedCity;
    }
    fetchWeather(); 
    setInterval(fetchWeather, 30 * 60 * 1000); // עדכון אוטומטי כל חצי שעה
});