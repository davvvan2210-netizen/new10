const totalBalance = document.getElementById('totalBalance');
const totalIncome = document.getElementById('totalIncome');
const totalExpense = document.getElementById('totalExpense');
const transactionForm = document.getElementById('transactionForm');
const descInput = document.getElementById('descInput');
const amountInput = document.getElementById('amountInput');
const typeSelect = document.getElementById('typeSelect');
const transactionList = document.getElementById('transactionList');

let transactions = JSON.parse(localStorage.getItem('myTransactions')) || [];

function saveAndRender() {
  localStorage.setItem('myTransactions', JSON.stringify(transactions));
  updateUI();
}

function updateUI() {
  transactionList.innerHTML = '';

  let income = 0;
  let expense = 0;

  transactions.forEach((item, index) => {
    const val = parseFloat(item.amount);
    if (item.type === 'income') {
      income += val;
    } else {
      expense += val;
    }

    const li = document.createElement('li');
    li.className = `transaction-item ${item.type}`;
    li.innerHTML = `
      <span>${item.desc}</span>
      <div>
        <strong>${item.type === 'income' ? '+' : '-'}₪${val.toFixed(2)}</strong>
        <button class="delete-btn" onclick="deleteTransaction(${index})">🗑️</button>
      </div>
    `;
    transactionList.appendChild(li);
  });

  const balance = income - expense;

  totalBalance.textContent = `₪${balance.toFixed(2)}`;
  totalIncome.textContent = `+₪${income.toFixed(2)}`;
  totalExpense.textContent = `-₪${expense.toFixed(2)}`;
}

transactionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeSelect.value;

  if (desc && !isNaN(amount) && amount > 0) {
    transactions.push({ desc, amount, type });
    descInput.value = '';
    amountInput.value = '';
    saveAndRender();
  }
});

function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveAndRender();
}

updateUI();