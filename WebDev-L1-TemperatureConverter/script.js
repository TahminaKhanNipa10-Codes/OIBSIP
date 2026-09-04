// Modal & DOM Elements
const errorModal = document.getElementById("errorModal");
const modalErrorMsg = document.getElementById("modal-error-msg");
const closeBtn = document.querySelector(".close-btn");
const modalOkBtn = document.getElementById("modalOkBtn");
const mainCard = document.getElementById("main-card");
const tempIcon = document.getElementById("temp-icon");
const resultBoxes = document.querySelectorAll(".result-box");

// Function to show modal with custom error message
function showError(message) {
  modalErrorMsg.textContent = message;
  errorModal.style.display = "flex";
  resetUI();
}

// Functions to close modal
function closeModal() {
  errorModal.style.display = "none";
}

closeBtn.addEventListener("click", closeModal);
modalOkBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === errorModal) closeModal();
});

// Function to reset UI before new calculation
function resetUI() {
  resultBoxes.forEach((box) => {
    box.classList.remove("show");
    box.textContent = "--";
  });
  mainCard.className = "converter-container";
  tempIcon.style.color = "#38bdf8";
}

// Main Conversion Event Listener
document.getElementById("convertBtn").addEventListener("click", function () {
  const tempInput = document.getElementById("tempInput").value.trim();
  const unitSelect = document.getElementById("unitSelect").value;

  resetUI();

  // 1. Validation: Check if input is completely empty
  if (tempInput === "") {
    return showError("Please enter a temperature.");
  }

  // 2. Validation: Check if input is not a number (e.g., "abc", "[]")
  if (isNaN(tempInput)) {
    return showError("Please enter a valid number.");
  }

  const temp = parseFloat(tempInput);
  let c, f, k;

  // Calculations & Absolute Zero Edge Case Validations
  if (unitSelect === "C") {
    if (temp < -273.15)
      return showError("Cannot fall below Absolute Zero (-273.15°C).");
    c = temp;
    f = (c * 9) / 5 + 32;
    k = c + 273.15;
  } else if (unitSelect === "F") {
    if (temp < -459.67)
      return showError("Cannot fall below Absolute Zero (-459.67°F).");
    f = temp;
    c = ((f - 32) * 5) / 9;
    k = c + 273.15;
  } else if (unitSelect === "K") {
    if (temp < 0) return showError("Cannot fall below Absolute Zero (0 K).");
    k = temp;
    c = k - 273.15;
    f = (c * 9) / 5 + 32;
  }

  // Dynamic UI Colors based on Celsius value
  if (c < 15) {
    mainCard.classList.add("glow-cold");
    tempIcon.style.color = "#38bdf8"; // Ice Blue
  } else if (c >= 15 && c <= 30) {
    mainCard.classList.add("glow-warm");
    tempIcon.style.color = "#facc15"; // Warm Yellow
  } else {
    mainCard.classList.add("glow-hot");
    tempIcon.style.color = "#ef4444"; // Hot Red
  }

  // Animate and Show Results with Staggered Delay
  setTimeout(() => {
    document.getElementById("resCelsius").textContent = `${c.toFixed(2)} °C`;
    document.getElementById("resFahrenheit").textContent = `${f.toFixed(2)} °F`;
    document.getElementById("resKelvin").textContent = `${k.toFixed(2)} K`;

    resultBoxes.forEach((box, index) => {
      setTimeout(() => {
        box.classList.add("show");
      }, index * 150);
    });
  }, 100);
});
