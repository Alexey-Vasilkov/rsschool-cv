const buttonsArray = [
  ["clear", "C"],
  ["delete", "CE"],
  ["sqrt", "√"],  
  ["operation", "÷"],
  ["number", "7"],
  ["number", "8"],
  ["number", "9"],
  ["operation", "x"],
  ["number", "4"],
  ["number", "5"],
  ["number", "6"],
  ["operation", "-"],
  ["number", "1"],
  ["number", "2"],
  ["number", "3"],
  ["operation", "+"],
  ["number", "0"],
  ["operation", "^"],
  ["number", ","],
  ["equals", "="],
];

const calculatorBody = document.createElement("div");
calculatorBody.className = "calculator-body";

const display = document.createElement("div");
display.className = "display";

const divCalc = document.createElement("div");
divCalc.setAttribute("data-calculation", "");
divCalc.className = "calculation";

const divResult = document.createElement("div");
divResult.setAttribute("data-result", "");
divResult.className = "result";

document.body.appendChild(calculatorBody);

let htmlButton = "";

const divDisplay = document.querySelector(".calculator-body").appendChild(display);
const divCalculator = document.querySelector(".display").appendChild(divCalc);
const divRes = document.querySelector(".display").appendChild(divResult);

buttonsArray.forEach((button) => {  
  htmlButton = document.createElement("button");
  htmlButton.setAttribute(`data-${button[0]}`, '');  
  htmlButton.innerText = `${button[1]}`;
  calculatorBody.appendChild(htmlButton);  
});


class Calculator {
  constructor(calculationTextElement, resultTextElement) {
    this.calculationTextElement = calculationTextElement;
    this.resultTextElement = resultTextElement;  
    this.clear();
  }
  clear() {
    this.firstOperand = "";
    this.secondOperand = "";
    this.currentOperation = "";
    this.result = "";
    this.calculation = "";
    this.operation = undefined;    
  }

  delete() {
    this.result = "";
  }

  appendNumber(number) {
    if (number === ",") {
      if (this.result.includes(",")) {
        return;
      }
      this.result += ".";
    } else {
      this.result = this.result.toString() + number.toString();
    }
  }

  chooseOperation(operation) {
    if (this.result === "") {
      return;
    }
    if (this.calculation !== "") {
      this.compute();
    }
    this.operation = operation;
    this.calculation = this.result;
    this.result = "";
  }

  compute() {
    let computation;
    const previous = parseFloat(this.calculation);
    const current = parseFloat(this.result);
    if (isNaN(previous) || isNaN(current)) return;
    switch (this.operation) { 
      case "^":
        computation = Math.pow(previous, current);
        break;
      case "+":
        computation = previous + current;
        break;
      case "-":
        computation = previous - current;
        break;
      case "x":
        computation = previous * current;
        break;
      case "÷":
        computation = previous / current;
        break;        
      default:
        return;
    }
    this.currentOperation = this.operation;
    this.firstOperand = previous;
    this.secondOperand = current;
    this.result = computation;
    this.operation = undefined;
    this.calculation = "";
  }

  sqrtFunction() {
    const current = parseFloat(this.result);
    this.result = Math.sqrt(current);
    this.operation = undefined;
    this.calculation = "";
  } 

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "0";
    } else {
      integerDisplay = integerDigits.toLocaleString("ru", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay},${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay(equal) {
    this.resultTextElement.innerText = this.getDisplayNumber(this.result);
    if (this.operation != null) {
      this.calculationTextElement.innerText = `${this.getDisplayNumber(this.calculation)} ${
        this.operation
      }`;
    }
    if (this.calculation === "") {
      this.calculationTextElement.innerText = "";
    }
    if (equal != null) {      
      this.result = "";
    }
  }
}

const sqrtButton = document.querySelector("[data-sqrt]");
const numberButtons = document.querySelectorAll("[data-number]");
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const clearButton = document.querySelector("[data-clear]");
const calculationTextElement = document.querySelector("[data-calculation]");
const resultTextElement = document.querySelector("[data-result]");

const calculator = new Calculator(calculationTextElement, resultTextElement);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
  });
});

sqrtButton.addEventListener("click", (button) => {
  calculator.sqrtFunction();
  calculator.updateDisplay("=");
});

equalsButton.addEventListener("click", (button) => {
  calculator.compute();
  calculator.updateDisplay("=");
});

clearButton.addEventListener("click", (button) => {
  calculator.clear();
  calculator.updateDisplay();
});

deleteButton.addEventListener("click", (button) => {
  calculator.delete();
  calculator.updateDisplay();
});
