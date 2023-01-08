'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
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

const accounts = [account1, account2, account3, account4];

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


const discplayMov = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type} deposit</div>
          <div class="movements__value">${mov}€</div>
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
createUserName(accounts)

const calcDisplayBalance = function (movements) {
  const balance = movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${balance} Eur`;
}


const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(elm => elm > 0)
    .reduce((acc, elm) => acc + elm, 0);
  labelSumIn.textContent = `${incomes} €`;

  const out = account.movements
    .filter(elm => elm < 0)
    .reduce((acc, elm) => acc + elm, 0);
  labelSumOut.textContent = `${out} €`;

  const interest = account.movements
    .filter(elm => elm > 0)
    .map(deposite => (deposite * account.interestRate) / 100)
    .filter((elm, i, arr) => {
      console.log(arr);
      return elm >= 1;
    })
    .reduce((acc, elm) => acc + elm, 0);
  labelSumInterest.textContent = `${interest}€`;
}



let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // preventing form sumbmitting
  currentAccount = accounts.find(account => account.username === inputLoginUsername.value);
  if (currentAccount?.pin === Number(inputLoginPin.value)) { //currentAccount? : if current account exists
    // display ui and message
    labelWelcome.textContent = `welcome ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 2;
    // clear fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur(); // lose focus = remove cursor blinking
    // display movements
    discplayMov(currentAccount.movements);

    // display balance
    calcDisplayBalance(currentAccount.movements);

    // display summary
    calcDisplaySummary(currentAccount);
  }

})