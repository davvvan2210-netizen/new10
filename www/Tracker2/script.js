// ==========================================
// 1. נתונים קיימים (משיכה מ-LocalStorage)
// ==========================================
let goalTitle = localStorage.getItem('savings_goal_title') || 'חופשה חלומית 🏖️';
let goalAmount = Number(localStorage.getItem('savings_goal_amount')) || 5000;
let savedAmount = Number(localStorage.getItem('savings_current_amount')) || 0;
let historyList = JSON.parse(localStorage.getItem('savings_history')) || [];

// ==========================================
// 2. תפיסת אלמנטים מה-HTML
// ==========================================
const goalTitleDisplay = document.getElementById('goalTitleDisplay');
const currentProgress = document.getElementById('currentProgress');
const progressBar = document.getElementById('progressBar');
const percentText = document.getElementById('percentText');
const remainingText = document.getElementById('remainingText');

const savingsForm = document.getElementById('savingsForm');
const descInput = document.getElementById('descInput');
const amountInput = document.getElementById('amountInput');

const historyListEl = document.getElementById('historyList');
const historyCountEl = document.getElementById('historyCount');
const resetSavingsBtn = document.getElementById('resetSavingsBtn');

// אלמנטים של המודל (הפופ-אפ)
const editGoalBtn = document.getElementById('editGoalBtn');
const goalModal = document.getElementById('goalModal');
const goalTitleInput = document.getElementById('goalTitleInput');
const goalAmountInput = document.getElementById('goalAmountInput');
const saveGoalBtn = document.getElementById('saveGoalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

// ==========================================
// 3. פונקציות לתצוגה ועדכון המסך
// ==========================================

function render() {
  updateGoalUI();
  renderHistoryUI();
  saveDataToStorage();
}

// עדכון היעד ומד ההתקדמות
function updateGoalUI() {
  goalTitleDisplay.textContent = goalTitle;
  currentProgress.textContent = `₪${savedAmount.toLocaleString()} / ₪${goalAmount.toLocaleString()}`;

  let percent = Math.min(100, Math.round((savedAmount / goalAmount) * 100)) || 0;
  progressBar.style.width = `${percent}%`;
  percentText.textContent = `${percent}% מומש`;

  let remaining = Math.max(0, goalAmount - savedAmount);
  remainingText.textContent = remaining === 0 ? '🎉 היעד הושג!' : `נשאר עוד ₪${remaining.toLocaleString()}`;
}

// עדכון רשימת ההפקדות הכלולה בתוך המודל
function renderHistoryUI() {
  historyListEl.innerHTML = '';

  if (historyList.length === 0) {
    historyListEl.innerHTML = '<li style="color: #64748b; font-size: 0.75rem; text-align: center; padding: 4px;">אין עדיין הפקדות</li>';
  }

  historyList.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = 'history-item';

    li.innerHTML = `
      <div>
        <div class="item-main">
          <span class="item-desc">${item.desc}</span>
          <span class="item-amount">+₪${item.amount.toLocaleString()}</span>
        </div>
        <div class="item-date">${item.date}</div>
      </div>
      <div class="item-actions">
        <button onclick="editDeposit(${index})" title="ערוך">✏️</button>
        <button onclick="deleteDeposit(${index})" title="מחק">🗑️</button>
      </div>
    `;

    historyListEl.appendChild(li);
  });

  historyCountEl.textContent = `${historyList.length} הפקדות`;
}

// שמירת נתונים בדפדפן
function saveDataToStorage() {
  localStorage.setItem('savings_goal_title', goalTitle);
  localStorage.setItem('savings_goal_amount', goalAmount);
  localStorage.setItem('savings_current_amount', savedAmount);
  localStorage.setItem('savings_history', JSON.stringify(historyList));
}

// ==========================================
// 4. אירועים ופעולות משתמש
// ==========================================

// הוספת הפקדה חדשה
savingsForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const desc = descInput.value.trim();
  const amount = Number(amountInput.value);

  if (!desc || amount <= 0) return;

  const now = new Date();
  const dateStr = `${now.toLocaleDateString('he-IL')} ${now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}`;

  savedAmount += amount;
  historyList.unshift({ desc, amount, date: dateStr });

  descInput.value = '';
  amountInput.value = '';
  render();
});

// מחיקת הפקדה
function deleteDeposit(index) {
  const item = historyList[index];
  if (confirm(`למחוק את ההפקדה "${item.desc}" ע"ס ₪${item.amount}?`)) {
    savedAmount = Math.max(0, savedAmount - item.amount);
    historyList.splice(index, 1);
    render();
  }
}

// עריכת הפקדה
function editDeposit(index) {
  const item = historyList[index];

  const newDesc = prompt('תיאור חדש:', item.desc);
  if (newDesc === null) return;

  const newAmountInput = prompt('סכום חדש ב-₪:', item.amount);
  const newAmount = Number(newAmountInput);

  if (newDesc.trim() !== '' && !isNaN(newAmount) && newAmount > 0) {
    savedAmount = savedAmount - item.amount + newAmount;
    item.desc = newDesc.trim();
    item.amount = newAmount;
    render();
  }
}

// איפוס מלא
resetSavingsBtn.addEventListener('click', () => {
  if (confirm('האם לאפס את כל החיסכון והרשימה?')) {
    savedAmount = 0;
    historyList = [];
    render();
  }
});

// --- פתיחה וסגירה של הפופ-אפ המרובע ---
editGoalBtn.addEventListener('click', () => {
  goalTitleInput.value = goalTitle;
  goalAmountInput.value = goalAmount;
  goalModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  goalModal.classList.add('hidden');
});

saveGoalBtn.addEventListener('click', () => {
  const newTitle = goalTitleInput.value.trim();
  const newAmount = Number(goalAmountInput.value);

  if (newTitle && newAmount > 0) {
    goalTitle = newTitle;
    goalAmount = newAmount;
    goalModal.classList.add('hidden');
    render();
  }
});

// טעינה ראשונית
render();