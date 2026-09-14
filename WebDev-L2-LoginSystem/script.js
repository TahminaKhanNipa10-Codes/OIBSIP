const authSection = document.getElementById("auth-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginBox = document.getElementById("login-box");
const registerBox = document.getElementById("register-box");
const toast = document.getElementById("toast");
const welcomeMsg = document.getElementById("welcome-msg");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

document.getElementById("go-to-reg").addEventListener("click", () => {
  loginBox.classList.add("hidden");
  registerBox.classList.remove("hidden");
});
document.getElementById("go-to-login").addEventListener("click", () => {
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

function showToast(message, type) {
  toast.textContent = message;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add("hidden"), 3000);
}

async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const user = document.getElementById("reg-user").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value.trim();

  if (user === "" || email === "" || pass === "") {
    return showToast("All fields are required!", "error");
  }

  const passRegex = /^(?=.*\d).{8,}$/;
  if (!passRegex.test(pass)) {
    return showToast("Password must be 8+ chars & contain a number.", "error");
  }

  const usersDB = JSON.parse(localStorage.getItem("usersDB")) || [];

  if (usersDB.find((u) => u.username === user || u.email === email)) {
    return showToast("Username or Email already exists!", "error");
  }

  const hashedPassword = await hashPassword(pass);
  usersDB.push({ username: user, email: email, password: hashedPassword });
  localStorage.setItem("usersDB", JSON.stringify(usersDB));

  showToast("Registration successful! Please login.", "success");
  registerForm.reset();
  registerBox.classList.add("hidden");
  loginBox.classList.remove("hidden");
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const loginID = document.getElementById("login-user").value.trim();
  const loginPass = document.getElementById("login-pass").value.trim();

  if (loginID === "" || loginPass === "") {
    return showToast("Please enter credentials.", "error");
  }

  const usersDB = JSON.parse(localStorage.getItem("usersDB")) || [];
  const hashedInputPass = await hashPassword(loginPass);

  const validUser = usersDB.find(
    (u) =>
      (u.username === loginID || u.email === loginID) &&
      u.password === hashedInputPass,
  );

  if (!validUser) {
    return showToast("Incorrect Username/Email or Password.", "error");
  }

  sessionStorage.setItem("activeSession", validUser.username);
  showToast("Login successful!", "success");
  loginForm.reset();
  checkSession();
});

document.getElementById("logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem("activeSession");
  checkSession();
  showToast("Logged out successfully.", "success");
});

function checkSession() {
  const activeUser = sessionStorage.getItem("activeSession");
  if (activeUser) {
    authSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    welcomeMsg.textContent = `Welcome, ${activeUser}!`;
  } else {
    dashboardSection.classList.add("hidden");
    authSection.classList.remove("hidden");
  }
}

checkSession();

const toggleLoginPass = document.getElementById("toggle-login-pass");
const loginPass = document.getElementById("login-pass");

toggleLoginPass.addEventListener("click", () => {
  const type = loginPass.type === "password" ? "text" : "password";
  loginPass.type = type;
  toggleLoginPass.textContent = type === "password" ? "👁️" : "🙈";
});

const toggleRegPass = document.getElementById("toggle-reg-pass");
const regPass = document.getElementById("reg-pass");

toggleRegPass.addEventListener("click", () => {
  const type = regPass.type === "password" ? "text" : "password";
  regPass.type = type;
  toggleRegPass.textContent = type === "password" ? "👁️" : "🙈";
});
