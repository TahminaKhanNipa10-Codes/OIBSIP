const screen = document.getElementById("screen");
const buttons = document.querySelectorAll(".btn");

let currentInput = "";

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let value = e.target.dataset.val;
    if (!value) {
      value = e.target.closest(".btn").dataset.val;
    }

    if (value === "C") {
      currentInput = "";
      screen.value = currentInput;
    } else if (value === "DEL") {
      currentInput = currentInput.toString().slice(0, -1);
      screen.value = currentInput;
    } else if (value === "=") {
      try {
        if (currentInput === "") return;

        // Convert symbols to JavaScript Math functions
        let expression = currentInput
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(")
          .replace(/log\(/g, "Math.log10(")
          .replace(/√\(/g, "Math.sqrt(")
          .replace(/π/g, "Math.PI")
          .replace(/\^/g, "**");

        let result = eval(expression);

        if (!isFinite(result) || isNaN(result)) {
          screen.value = "Error";
          currentInput = "";
        } else {
          // Rounding off to fix JS floating point bugs
          result = parseFloat(result.toFixed(8));
          screen.value = result;
          currentInput = result.toString();
        }
      } catch (error) {
        screen.value = "Syntax Error";
        currentInput = "";
      }
    } else {
      currentInput += value;
      screen.value = currentInput;
    }
  });
});
