module.exports = {
    constantExpression: {
        precedence: 0,
        arity: 0
    },
    variableExpression: {
        precedence: 0,
        arity: 0,
    },
    basicFunctionExpression: {
        precedence: 0,
        arity: 0,
    },
    constantExponentialExpression: {
        precedence: 1,
        arity: 2,
    },
    constantPowerExponentialExpression: {
        precedence: 1,
        arity: 2,
    },
    constantBaseExponentialExpression: {
        precedence: 1,
        arity: 2,
    },
    generalExponentialExpression: {
        precedence: 1,
        arity: 2,
    },
    unaryMinusExpression: {
        precedence: 2,
        arity: 1,
    },
    multiplicationExpression: {
        precedence: 3,
        arity: 2,
    },
    divisionExpression: {
        precedence: 3,
        arity: 2,
    },
    derivativeExpression: {
        precedence: 4,
        arity: 1,
    },
    additionExpression: {
        precedence: 5,
        arity: 2,
    },
    subtractionExpression: {
        precedence: 5,
        arity: 2,
    },
}