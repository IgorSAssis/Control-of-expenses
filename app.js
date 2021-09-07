const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));

let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

const transactionsUl = document.getElementById("transactions");
const revenueDisplay = document.getElementById("money-plus");
const expenseDisplay = document.getElementById("money-minus");
const balanceDisplay = document.getElementById("balance");
const form = document.getElementById("form");
const inputTransactionName = document.getElementById("text");
const inputTransactionAmount = document.getElementById("amount");

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID);
    updateLocalStorage();
    init();
};

const addTransactionIntoDOM = ({ id, name, amount }) => {

    const operator = amount < 0 ? '-' : '+';
    const CSSClass = amount < 0 ? "minus" : "plus";
    const amountWithoutOperator = Math.abs(amount);
    const li = document.createElement("li");

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${name} <span>${operator} R$ ${amountWithoutOperator}</span><button class="delete-btn" onclick="removeTransaction(${id})">x</button>
    `;

    transactionsUl.append(li);

};

const getExpenses = transactionsAmounts => Math.abs(
    transactionsAmounts
        .filter(amount => amount < 0)
        .reduce((accumulator, amount) => accumulator + amount, 0))
    .toFixed(2);

const getRevenues = transactionsAmounts => transactionsAmounts
    .filter(amount => amount > 0)
    .reduce((accumulator, amount) => accumulator + amount, 0)
    .toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, amount) => accumulator + amount, 0)
    .toFixed(2);

const updateBalanceValues = () => {

    const transactionsAmounts = transactions.map(({ amount }) => amount);
    const total = getTotal(transactionsAmounts);
    const totalRevenues = getRevenues(transactionsAmounts);
    const totalExpense = getExpenses(transactionsAmounts);

    balanceDisplay.textContent = `R$ ${total}`;
    revenueDisplay.textContent = `R$ ${totalRevenues}`;
    expenseDisplay.textContent = `R$ ${totalExpense}`;

};

const init = () => {

    transactionsUl.innerHTML = "";
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();

};

init();

const updateLocalStorage = () => {

    localStorage.setItem("transactions", JSON.stringify(transactions));

};

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {

    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    });

};

const cleanTransactionInputs = () => {

    inputTransactionAmount.value = "";
    inputTransactionName.value = "";

};

const handleFormSubmit = event => {

    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === "" || transactionAmount === "";

    if (isSomeInputEmpty) {
        alert("Preencha o nome e o valor da transação!");
        return;
    }
    addToTransactionsArray(transactionName, transactionAmount);
    init();
    updateLocalStorage();
    cleanTransactionInputs();

};

form.addEventListener("submit", handleFormSubmit);