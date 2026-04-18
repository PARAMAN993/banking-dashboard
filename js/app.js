// ================= SESSION CHECK =================
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// If user is logged in, prevent going back to login/register
if (currentUser) {
  if (
    window.location.pathname.includes("login.html") ||
    window.location.pathname.includes("register.html")
  ) {
    window.location.href = "dashboard.html";
  }
}


// ================= REGISTER =================
const form = document.getElementById("registerForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user already exists
    const exists = users.find(user => user.email === email);
    if (exists) {
      alert("User already exists");
      return;
    }

   const hashedPassword = btoa(password);

const hashedPassword = btoa(password);

const newUser = {
  username,
  email,
  password: hashedPassword,
  balance: 0,
  transactions: []
};

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful!");
    window.location.href = "login.html";
  });
}


// ================= LOGIN =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const hashedInput = btoa(password);

const hashedInput = btoa(password);

const user = users.find(
  u => u.email === email && u.password === hashedInput
);

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid credentials");
    }
  });
}


// ================= DASHBOARD LOAD =================
if (window.location.pathname.includes("dashboard.html")) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    window.location.href = "login.html";
  } else {
    document.getElementById("usernameDisplay").textContent = user.username;
    document.getElementById("balance").textContent = user.balance;

    displayTransactions(user.transactions);
  }
}


// ================= DEPOSIT =================
function deposit() {
  const amount = Number(document.getElementById("depositAmount").value);
  let user = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users"));

  if (amount > 0) {
    user.balance += amount;

    user.transactions.push({
  type: "deposit",
  amount,
  date: new Date().toLocaleString()
});

    // Update user in users array
    const index = users.findIndex(u => u.email === user.email);
    users[index] = user;

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(user));

    location.reload();
  } else {
    alert("Enter a valid amount");
  }
}


// ================= SEND MONEY =================
function transferMoney() {
  const amount = Number(document.getElementById("sendAmount").value);
  const recipientEmail = document.getElementById("recipientEmail").value;

  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let users = JSON.parse(localStorage.getItem("users"));

  if (!recipientEmail || amount <= 0) {
    alert("Enter valid details");
    return;
  }

  const recipient = users.find(u => u.email === recipientEmail);

  if (!recipient) {
    alert("Recipient not found");
    return;
  }

  if (recipient.email === currentUser.email) {
    alert("You cannot send money to yourself");
    return;
  }

  if (amount > currentUser.balance) {
    alert("Insufficient balance");
    return;
  }

  // Deduct from sender
  currentUser.balance -= amount;
  currentUser.transactions.push({
  type: "send",
  amount,
  to: recipient.email,
  date: new Date().toLocaleString()
});

  // Add to recipient
  recipient.balance += amount;
 recipient.transactions.push({
  type: "deposit",
  amount,
  from: currentUser.email,
  date: new Date().toLocaleString()
});

  // Update users array
  const senderIndex = users.findIndex(u => u.email === currentUser.email);
  const recipientIndex = users.findIndex(u => u.email === recipient.email);

  users[senderIndex] = currentUser;
  users[recipientIndex] = recipient;

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  alert("Transfer successful!");
  location.reload();
}

// ================= DISPLAY TRANSACTIONS =================
function displayTransactions(transactions) {
  const list = document.getElementById("transactionsList");
  list.innerHTML = "";

  transactions.slice().reverse().forEach((t) => {
    const li = document.createElement("li");

    li.classList.add(t.type);

    let text = `${t.type.toUpperCase()} - ₦${t.amount}`;

    if (t.to) text += ` → ${t.to}`;
    if (t.from) text += ` ← ${t.from}`;

    text += ` (${t.date})`;

    li.textContent = text;

    list.appendChild(li);
  });
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}