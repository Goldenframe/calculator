let output = document.querySelector('.output');

let result = document.querySelector('.result')

let prevResult;

function addInput(num) {
    output.value += num.value;
}

function resetCalculator() {
    output.value = ''
}

function getPreviousResult() {
    if (prevResult) {
        output.value = prevResult;
        result.textContent = '';
    }
    else {
        alert('Сначала необходимо ввести данные')
    }

}

function calculateResult() {
    try {
        result.textContent = eval(output.value.replace(/^0+/, ''));
        prevResult = output.value;


    } catch (err) {
        alert('Похоже, данные были введены некорректно, попробуйте еще раз!');
    }
    finally {
        resetCalculator();
    }
}

