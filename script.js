'use strict';

// Data
const account1 = {
  owner: 'Jevon Broomes',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Simon Prophet',
  movements: [1430, 1000, 1700, 250, 990],
  interestRate: 2.3,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

console.log(`------ BANKIST APP CODE ---------`);

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const newUser = document.querySelector('.new__user');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// BUILDING OUT BANKIST APP

// DISPLAY MOVEMENTS - accounts deposits and withdrawals
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ' ';

  const sortMovements = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;

  sortMovements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = ` 
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Creating the USERNAMES

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};

createUsernames(accounts);
// console.log(accounts);

// Display Balance on BANKIST App

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `£${acc.balance}`;
};

// Display Summary

const calcDisplaySummary = function (acc) {
  const deposit = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `£${deposit}`;

  const withdrawal = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `£${Math.abs(withdrawal)}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((i) => i >= 1)
    .reduce((acc, mov, i, arr) => acc + mov, 0);
  labelSumInterest.textContent = `£${interest.toFixed(2)}`;
};

// LOGIN Event handler

// track current user account
let currentUser;

// UPDATE handler

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);

  //Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

btnLogin.addEventListener('click', function (e) {
  // to prevent the form from submitting
  e.preventDefault();
  //console.log(`we in`);

  currentUser = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  ); // use of .find
  // console.log(currentUser);

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // above ? optional chaining
    //Display UI and welcome text
    labelWelcome.textContent = `Welcome back, ${
      currentUser.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    newUser.style.opacity = 0;

    // updateUI
    updateUI(currentUser);

    // clear input form
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
  }
});

// TRANSFER

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);

  // clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    receiverAcc &&
    currentUser.balance >= amount &&
    receiverAcc?.username !== currentUser.username
  ) {
    // making transfer
    currentUser.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // updateUI
    updateUI(currentUser);
  }
});

// LOAN BTN

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentUser.movements.some(function (mov) {
      return mov >= loanAmount * 0.1;
    })
  ) {
    currentUser.movements.push(loanAmount);
    updateUI(currentUser);
  }
  inputLoanAmount.value = '';
});

// DELETE Or CLOSE ACCOUNT

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    // check user is correct
    currentUser.username === inputCloseUsername.value &&
    // check if pin is correct
    currentUser.pin === Number(inputClosePin.value)
  ) {
    //console.log(`OUT`);
    // to find account idex
    const index = accounts.findIndex(function (acc) {
      return currentUser.username === acc.username;
    });
    // delete account
    accounts.splice(index, 1);
    //console.log(`And you're OUT`);
    // Hide UI
    containerApp.style.opacity = 0;
    // reset Welcome
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Sorting account movements

let sortedState = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault;
  displayMovements(currentUser.movements, !sortedState);
  sortedState = !sortedState;
});
