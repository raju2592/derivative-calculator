/** helpers */
const returnLexeme = function() {
    return this.parseTree[0].lexeme;
};

const unaryPlusToString = function() {
    return this.parseTree[1].toString();
};

const unaryPlusDerivative = function() {
    const childDerivative = this.parseTree[1].derivative()
    return {
        function: this.toString(),
        result: oneChildDerivative.result,
        rule: null,
        appliedRule: null,
        childDerivatives: [childDerivative],
    }
};

exports.expressionUnaryPlus = (parsedObject) => {
    parsedObject.toString = unaryPlusToString;
    parsedObject.derivative = unaryPlusDerivative;
    return parsedObject;
}

const unaryMinusToString = function() {
    return '-' + '(' + this.parseTree[1].toString() + ')';
};

const unaryMinusDerivative = function() {
    const thisFunction = this.toString();
    const negationArgument = this.parseTree[1];
    const negationArgumentFunction = negationArgument.toString();
    const negationArgumentDerivative = negationArgument.derivative();
    return {
        function: thisFunction,
        result: '-' + '(' + negationArgumentDerivative.result + ')',
        rule: 'd/dx -f(x) = -d/dx f(x)',
        appliedRule: 'd/dx ' + thisFunction + '=' + '-' + 'd/dx' + negationArgumentFunction,
        childDerivatives: [negationArgumentDerivative],
    }
};

exports.expressionUnaryMinus = (parsedObject) => {
    parsedObject.toString = unaryMinusToString;
    parsedObject.derivative = unaryMinusDerivative;
    return parsedObject;
}

const oneChildToString = function() {
    return this.parseTree[0].toString();
}

const oneChildDerivative = function() {
    const childDerivative = this.parseTree[0].derivative()
    return {
        function: this.toString(),
        result: childDerivative.result,
        rule: null,
        appliedRule: null,
        childDerivatives: [this.parseTree[0].derivative()],
    }
};

exports.expressionOneChild = (parsedObject) => {
    parsedObject.toString = oneChildToString;
    parsedObject.derivative = oneChildDerivative;
    return parsedObject;
}

const constantDerivative = function() {
    return {
        function: this.toString(),
        result: '0',
        rule: 'd/dx c = 0',
        appliedRule: null,
        childDerivatives: null,
    }
};

exports.expressionConstant = (parsedObject) => {
    parsedObject.toString = returnLexeme;
    parsedObject.derivative = constantDerivative;
    return parsedObject;
};

const xDerivative = function() {
    const thisFunction = this.toString();
    return {
        function: this.toString(),
        result: '1',
        rule: 'd/dx x = 1',
        appliedRule: null,
        childDerivatives: null,
    }
};

exports.expressionX = (parsedObject) => {
    parsedObject.toString = returnLexeme,
    parsedObject.derivative = xDerivative;
    return parsedObject;
};

const parenthesizedFunctionString = function() {
    return this.parseTree[1].func();
};
const parenthesizedFunctionDerivative = function() {
    return {
        function: this.toString(),
        result: null,
        rule: null,
        appliedRule: null,
        childDerivatives: [this.parseTree[1].derivative()],
    }
};
exports.expressionParathesizedFunction = (parsedObject) => {
    parsedObject.toString = parenthesizedFunctionString;
    parsedObject.derivative = parenthesizedFunctionDerivative;
    return parsedObject;
};

const sinXToString = function() {
    return 'sin(x)';
};

const sinXDerivative = function() {
    const thisFunction = this.toString();
    return {
        function: thisFunction,
        result: 'cos(x)',
        rule: 'd/dx sin(x) = cos(x)',
        appliedRule: null,
        childDerivatives: null,
    }
};

exports.expressionSinX = (parsedObject) => {
    //console.log('six called');
    parsedObject.toString = sinXToString;
    parsedObject.derivative = sinXDerivative;
    return parsedObject;
};

const sinFxToString = function() {
    return 'sin' + '(' + this.parseTree[2].toString() + ')';
};

const sinFxDerivative = function() {
    const thisFunction = this.toString();
    const sinArgument = this.parseTree[2];
    const sinArgumentFunction = sinArgument.toString();
    const sinArgumentDerivative = sinArgument.derivative();
    return {
        function: thisFunction,
        result: 'cos' + '(' + sinArgumentFunction + ')' + '(' + sinArgumentDerivative.result + ')',
        rule: 'd/dx sin(x) = cos(x) and d/dx f(g(x)) = f\'(g(x)) d/dx g(x)',
        appliedRule: 'd/dx' + thisFunction + '=' + 'cos' + '(' + thisFunction + ')' + 'd/dx' + '(' + sinArgumentFunction + ')',
        childDerivatives: [sinArgumentDerivative],
    }
};

exports.expressionSinFx = (parsedObject) => {
    parsedObject.toString = sinFxToString;
    parsedObject.derivative = sinFxDerivative;
    return parsedObject;
};
