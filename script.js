'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2023-02-06T23:36:17.929Z',
    '2023-02-10T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};


const accounts = [account1, account2];

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

const formatMovementDate = function (date) {

  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

  // call calcDaysPassed function
  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  // show date better : Today, yesterday, ...
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed < 7) return `${daysPassed} days ago`;
  if (daysPassed === 7) return  'Last week';
  else {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, 0); // getMonth method is zero base so we should add 1 to it
    const day = `${date.getDate()}`.padStart(2, 0);

    return `${day}/${month}/${year}`;
  }

}

const displayMov = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const moves = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  moves.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type} deposit</div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
  `
    containerMovements.insertAdjacentHTML("afterbegin", html)
  })
}


const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner  //// username property added to each account object
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('')
    console.log(acc)
  })
}
createUserName(accounts);

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  // account.balance = balance;
  labelBalance.textContent = `${account.balance.toFixed(2)} Eur`;
}


const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(elm => elm > 0)
    .reduce((acc, elm) => acc + elm, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)} €`;

  const out = account.movements
    .filter(elm => elm < 0)
    .reduce((acc, elm) => acc + elm, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)} €`;

  const interest = account.movements
    .filter(elm => elm > 0)
    .map(deposite => (deposite * account.interestRate) / 100)
    .filter((elm, i, arr) => {
      console.log(arr);
      return elm >= 1;
    })
    .reduce((acc, elm) => acc + elm, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
}

const updateUi = function (account) {
  // display movements
  displayMov(account);

  // display balance
  calcDisplayBalance(account);

  // display summary
  calcDisplaySummary(account);
}

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // preventing form sumbmitting
  currentAccount = accounts.find(account => account.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) { //currentAccount? : if current account exists
    // display ui and message
    labelWelcome.textContent = `welcome ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100;

    // create current date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0); // getMonth method is zero base so we should add 1 to it
    const day = `${now.getDate()}`.padStart(2, 0);

    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur(); // lose focus = remove cursor blinking

    updateUi(currentAccount);


    [...document.querySelectorAll('.movements__row')].
      forEach((row, i) => {
        if (i % 2 === 0) row.style.backgroundColor = '#def9f8'
      })
  }
})

// fake login
// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 100;


btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  console.log(amount, reciverAcc)
  inputTransferTo.value = inputTransferAmount.value = ''; // equal with below code
  // inputTransferTo.value = '';
  // inputTransferAmount.value = '';

  if (amount > 0 && reciverAcc && currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username) {

    // doing the transfer
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date());
    reciverAcc.movementsDates.push(new Date().toISOString());

    // updating ui
    updateUi(currentAccount);
  }
})

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movment 
    currentAccount.movements.push(amount);

    // add loan date
    currentAccount.movementsDates.push(new Date().toISOString());


    // update ui
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
})

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index)

    // delete account
    accounts.splice(index, 1);

    // hide ui
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
  }
})

let sorted = false
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMov(currentAccount.movements, !sorted)
  sorted = !sorted;
})


// labelBalance.addEventListener('click', function(){
//   const movementsUi = Array.from(document.querySelectorAll('.movements__value'),
//   el => Number(el.textContent.replace('€','')))

//   console.log(movementsUi);
// })


