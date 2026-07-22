let timeLeft = 25 * 60; // 25 דקות בשניות
let timerId = null;
let isWorkMode = true;

const timerDisplay = document.getElementById('timer');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const workModeBtn = document.getElementById('workMode');
const breakModeBtn = document.getElementById('breakMode');

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
  if (timerId !== null) return;

  startPauseBtn.textContent = 'השהה';
  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft === 0) {
      clearInterval(timerId);
      timerId = null;
      alert(isWorkMode ? 'זמן ההספקה הגיע! קח 5 דקות.' : 'ההפסקה הסתיימה, חוזרים לעבודה!');
      switchMode(!isWorkMode);
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerId);
  timerId = null;
  startPauseBtn.textContent = 'המשך';
}

function resetTimer() {
  clearInterval(timerId);
  timerId = null;
  timeLeft = isWorkMode ? 25 * 60 : 5 * 60;
  startPauseBtn.textContent = 'התחל';
  updateDisplay();
}

function switchMode(work) {
  isWorkMode = work;
  workModeBtn.classList.toggle('active', isWorkMode);
  breakModeBtn.classList.toggle('active', !isWorkMode);
  resetTimer();
}

// מאזיני אירועים
startPauseBtn.addEventListener('click', () => {
  if (timerId === null) {
    startTimer();
  } else {
    pauseTimer();
  }
});

resetBtn.addEventListener('click', resetTimer);

workModeBtn.addEventListener('click', () => switchMode(true));
breakModeBtn.addEventListener('click', () => switchMode(false));

// אתחול ראשוני
updateDisplay();