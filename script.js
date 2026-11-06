const output = document.querySelector('.output');
const result = document.querySelector('.result');
let previousResult;

function addInput(button) {
    output.value += button.value;
    result.textContent = '';
}

function resetCalculator() {
    output.value = '';
    result.textContent = '';
}

function getPreviousResult() {
    if (previousResult === undefined) {
        result.textContent = 'Сначала выполните вычисление.';
        return;
    }

    output.value = previousResult;
    result.textContent = '';
}

function evaluateExpression(expression) {
    const tokens = expression.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\*\*|[+*/-]|\s+|./gi) ?? [];
    const parts = tokens.filter(token => token.trim());
    let index = 0;

    function readNumber() {
        const token = parts[index++];
        if (token === '(') {
            const value = readSum();
            if (parts[index++] !== ')') throw new Error('Закройте скобку.');
            return value;
        }
        if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(token ?? '')) {
            throw new Error('Введите корректное выражение.');
        }
        return Number(token);
    }

    function readPower() {
        const base = readNumber();
        if (parts[index] !== '**') return base;

        index++;
        return base ** readSigned();
    }

    function readSigned() {
        const sign = parts[index];
        if (sign === '+' || sign === '-') {
            index++;
            const value = readSigned();
            return sign === '-' ? -value : value;
        }
        return readPower();
    }

    function readProduct() {
        let value = readSigned();

        while (parts[index] === '*' || parts[index] === '/') {
            const operator = parts[index++];
            const next = readSigned();
            if (operator === '/' && next === 0) {
                throw new Error('На ноль делить нельзя.');
            }
            value = operator === '*' ? value * next : value / next;
        }
        return value;
    }

    function readSum() {
        let value = readProduct();

        while (parts[index] === '+' || parts[index] === '-') {
            const operator = parts[index++];
            const next = readProduct();
            value = operator === '+' ? value + next : value - next;
        }
        return value;
    }

    const value = readSum();
    if (index !== parts.length) throw new Error('Введите корректное выражение.');
    return value;
}

function showCalculation(transform) {
    try {
        const value = transform(evaluateExpression(output.value));
        if (!Number.isFinite(value)) throw new Error('Результат не является конечным числом.');

        previousResult = value;
        output.value = value;
        result.textContent = '';
    } catch (error) {
        result.textContent = error instanceof RangeError
            ? 'Выражение слишком длинное.'
            : error.message;
    }
}

function calculateResult() {
    showCalculation(value => value);
}

function calculateSquareRoot() {
    showCalculation(value => {
        if (value < 0) throw new Error('Квадратный корень из отрицательного числа не определён.');
        return Math.sqrt(value);
    });
}

document.querySelector('.calculator form').addEventListener('submit', event => {
    event.preventDefault();
    calculateResult();
});
