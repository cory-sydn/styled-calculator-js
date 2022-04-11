"use strict";

// clear-all, clean(delete), numbers, operators, computation , equals
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.allClear();
    };

    allClear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
        this.updateDisplay();
    };

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === "-" || this.currentOperand === "Infinit" || this.currentOperand === "-Infinit" ) { 
            resetNegation = false;
            this.currentOperand = "";      
        }
    };

    appendNumber(number) {
        if (number === "." && this.currentOperand.includes(".")) return
        this.currentOperand = this.currentOperand.toString() + number.toString();
        number = "";
    };

    chooseOperator(operation) {
        if(this.currentOperand === "") return
        if (this.currentOperand[0] === "." && this.currentOperand[1] === undefined) return
        if (this.previousOperand !== "" ){ this.compute()};
        this.operation = operation;  
        this.previousOperand = this.currentOperand;
        this.currentOperand= "";
        this.updateDisplay();
    };

    compute() {
        this.computedValue = this.operation ==="+" ? parseFloat(this.previousOperand) + parseFloat(this.currentOperand) 
            : this.operation ==="−" ? this.previousOperand - this.currentOperand
            : this.operation ==="×" ? this.previousOperand * this.currentOperand
            : this.previousOperand / this.currentOperand;
        this.previousOperandTextElement.innerText = "";
        this.previousOperand = "";
        this.currentOperand = this.computedValue;
    }

    result() {
        if (this.currentOperand[0] === "." && this.currentOperand[1] === undefined) return
        if (this.previousOperand === undefined || this.previousOperand === "" ) return
        this.compute();
        this.previousOperandTextElement.innerText = "";
        this.currentOperandTextElement.innerText = this.computedValue;
        this.currentOperand = this.computedValue;
        this.operation = "";
    };

    // get thousand separator commas
    displayNumStyle(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if ( isNaN(integerDigits)) {
            integerDisplay = "";
        } else {
            integerDisplay = integerDigits.toLocaleString("en", {maximumFractionDigits: 0 })
        }
        
        if ( decimalDigits !== undefined ) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }       
    };

    updateDisplay() {
        if (this.currentOperand === "-0") { this.currentOperandTextElement.innerText = "-"}
        else {
        this.currentOperandTextElement.innerText = this.displayNumStyle(this.currentOperand);
        this.previousOperandTextElement.innerText = this.displayNumStyle(this.previousOperand) + (this.operation !== undefined ? this.operation : "")}
    };
};

const previousOperandTextElement = document.querySelector("[data-previous-operand]");
const currentOperandTextElement = document.querySelector("[data-current-operand]");

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll("[data-operation]");
const equalsButton = document.querySelector("[data-equals]");
const deleteButton = document.querySelector("[data-delete]");
const allClearButton = document.querySelector("[data-all-clear]");

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// allows first input negation
let resetNegation = false;   

for (const btn of numberButtons){
    btn.addEventListener("click", (e) => {
        calculator.appendNumber(e.target.innerText);
        calculator.updateDisplay();
        resetNegation= true;
    })
};

operationButtons.forEach(operator => {
    operator.addEventListener("click", () => {
        if ( resetNegation === false && operator.innerText === "−")  {
            calculator.appendNumber("-0");
            calculator.updateDisplay();
            resetNegation = true;
        } else {
            calculator.chooseOperator(operator.innerText);
            calculator.updateDisplay();
        }
    })
});

allClearButton.addEventListener("click", ()=> {
    calculator.allClear();
    resetNegation = false;
});

deleteButton.addEventListener("click", () => {
    calculator.delete();
    calculator.updateDisplay();
});

equalsButton.addEventListener("click", () => {
    calculator.result();
});