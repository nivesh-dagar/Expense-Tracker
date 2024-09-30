var state = {
  earnings: 0,
  expenses: 0,
  net: 0,
  transactions: [],
};
var isUpdate = false;
var tid;

var transactionFormEl = document.getElementById("transactionForm");

var renderTransactions = () => {
  var transactionContainerEl = document.querySelector(".transactions");
  var netAmountEl = document.getElementById("netAmount");
  var earningEl = document.getElementById("earning");
  var expenseEl = document.getElementById("expense");

  var transactions = state.transactions;
  var earning = 0;
  var expense = 0;
  var net = 0;

  transactionContainerEl.innerHTML = "";

  transactions.forEach((transaction) => {
    var { id, amount, text, type } = transaction;
    var isCredit = type == "credit" ? true : false;
    var sign = isCredit ? "+" : "-";

    var transactionEl =
      // TRANSACTIONS
      `<div class="transaction" id="${id}">
        <div class="content" onclick = "showEdit(${id})">
          <div class="left">
          <p> ${text}</p>
          <p>${sign} ₹ ${amount}</p>
        </div>
        <div class="status ${isCredit ? "credit" : "debit"}"> ${
        isCredit ? "C" : "D"
      } </div>
        </div>
        <div class="lower">
          <div class="icon" onclick ="handleUpdate(${id})">
          <img src="pen.svg" alt="" />
          </div>
          <div class="icon" onclick ="handleDelete(${id})">
            <img src="trash.svg" alt="" />
          </div>
        </div>
      </div>`;

    earning += isCredit ? amount : 0;
    expense += !isCredit ? amount : 0;
    net = earning - expense;

    // transactionContainerEl += transactionEl;
    transactionContainerEl.insertAdjacentHTML("afterbegin", transactionEl);
  });

  netAmountEl.innerHTML = `₹ ${net}`;
  earningEl.innerHTML = `₹ ${earning}`;
  expenseEl.innerHTML = `₹ ${expense}`;
};

var addTransaction = (e) => {
  e.preventDefault();

  var isEarn = e.submitter.id == "earnBtn" ? true : false;

  var formData = new FormData(transactionFormEl);

  var tData = {};
  formData.forEach((value, key) => {
    tData[key] = value;
  });

  var { text, amount } = tData;
  var transaction = {
    id: isUpdate ? tid : Math.floor(Math.random() * 1000),
    text: text,
    amount: +amount,
    type: isEarn ? "credit" : "debit",
  };

  if (isUpdate) {
    var tIndex = state.transactions.findIndex((t) => t.id == tid);
    state.transactions[tIndex] = transaction;
    isUpdate = false;
    tid = null;
  } else {
    state.transactions.push(transaction);
  }

  // state.transactions.push(transaction);
  renderTransactions();

  transactionFormEl.reset();
  console.log({ state });
};

var showEdit = (id) => {
  var selectedTransaction = document.getElementById(id);
  var lowerEl = selectedTransaction.querySelector(".lower");

  lowerEl.classList.toggle("showTransaction");
};

var handleUpdate = (id) => {
  var transaction = state.transactions.find((t) => t.id == id);

  var { text, amount } = transaction;
  var textInput = document.getElementById("text");
  var amountInput = document.getElementById("amount");
  textInput.value = text;
  amountInput.value = amount;

  tid = id;
  isUpdate = true;
};

var handleDelete = (id) => {
  var filteredTransaction = state.transactions.filter((t) => t.id !== id);

  state.transactions = filteredTransaction;
  renderTransactions();
};

// renderTransactions();
transactionFormEl.addEventListener("submit", addTransaction);
