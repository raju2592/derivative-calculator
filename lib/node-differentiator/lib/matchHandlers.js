const expressions = require('./expressions');

const getLexeme = function(parsedObject) {
    return parsedObject.parseTree[0].lexeme;
};

const getExpressionOfIndex = (parsedObject, index) => {
    return parsedObject.parseTree[index].expression;
};

exports.matchUnaryPlus = (parsedObject) => {
    parsedObject.expression = getExpressionOfIndex(parsedObject, 2);
    return parsedObject;
};

exports.matchUnaryMinus = (parsedObject) => {
    parsedObject.expression = expressions.unaryMinusExpression(getExpressionOfIndex(parsedObject, 1));
    return parsedObject;
};

exports.matchOneChild = (parsedObject) => {
    parsedObject.expression = getExpressionOfIndex(parsedObject, 0);
    return parsedObject;
};

exports.matchConstant = (parsedObject) => {
    parsedObject.expression = expressions.constantExpression(getLexeme(parsedObject));
    return parsedObject;
};

exports.matchX = (parsedObject) => {
    // // // console.log(parsedObject);
    parsedObject.expression = expressions.variableExpression();
    // // // console.log(parsedObject);
    return parsedObject;
};

exports.matchParanthesizedFunction = (parsedObject) => {
    // console.log('parenthesized is called ..............yahoooooooo---------');
    parsedObject.expression = getExpressionOfIndex(parsedObject, 1);
    return parsedObject;
};

exports.matchConstantExponential = (parsedObject) => {
    parsedObject.expression = expressions.constantExponentialExpression(
        getExpressionOfIndex(parsedObject, 0), getExpressionOfIndex(parsedObject, 2)
    );
    return parsedObject;
}

exports.matchConstantPowerExponential = (parsedObject) => {
    parsedObject.expression = expressions.constantPowerExponentialExpression(
        getExpressionOfIndex(parsedObject, 0), getExpressionOfIndex(parsedObject, 2)
    );
    return parsedObject;
};

exports.matchConstantBaseExponential = (parsedObject) => {
    parsedObject.expression = expressions.constantBaseExponentialExpression(
        getExpressionOfIndex(parsedObject, 0), getExpressionOfIndex(parsedObject, 2)
    );
    return parsedObject;
};

exports.matchGeneralExponential = (parsedObject) => {
    parsedObject.expression = expressions.generalExponentialExpression(
        getExpressionOfIndex(parsedObject, 0), getExpressionOfIndex(parsedObject, 2)
    );
    return parsedObject;
};

exports.matchTerm = (parsedObject) => {
    // console.log(parsedObject);
    let moreFactors = parsedObject.parseTree[1];
    let termExpression = getExpressionOfIndex(parsedObject, 0);
    // console.log(termExpression);
    while(moreFactors.parseTree.length !== 1)  { // moreFactors -> _epsilon rule
        const operation = moreFactors.parseTree[0];
        const operandExpression = getExpressionOfIndex(moreFactors, 1);
        // console.log(operandExpression);
        if(operation.tokenName === '*') {
            termExpression = expressions.multiplicationExpression(termExpression, operandExpression);
        } else {
            termExpression = expressions.divisionExpression(termExpression, operandExpression);
        }
        moreFactors = moreFactors.parseTree[2];
    }
    // console.log(termExpression);
    parsedObject.expression = termExpression;
    return parsedObject;
}

exports.matchFunction = (parsedObject) => {
    let moreTerms = parsedObject.parseTree[1];
    let functionExpression = getExpressionOfIndex(parsedObject, 0);
    //// console.log(functionExpression);
    // // console.log(parsedObject.parseTree);
    while(moreTerms.parseTree.length !== 1)  { // moreFactors -> _epsilon rule
        const operation = moreTerms.parseTree[0];
        const operandExpression = getExpressionOfIndex(moreTerms, 1);
        //// console.log(operandExpression);
        if(operation.tokenName === '+') {
            functionExpression = expressions.additionExpression(functionExpression, operandExpression);
        } else {
            functionExpression = expressions.subtractionExpression(functionExpression, operandExpression);
        }
        moreTerms = moreTerms.parseTree[2];
    }
    parsedObject.expression = functionExpression;
    //// console.log(parsedObject);
    return parsedObject;
};

exports.matchSin = (parsedObject) => {
    parsedObject.expression = expressions.sinExpression(getExpressionOfIndex(parsedObject, 2));
    return parsedObject;
};

exports.matchCos = (parsedObject) => {
    parsedObject.expression = expressions.cosExpression(getExpressionOfIndex(parsedObject, 2));
    return parsedObject;
};

exports.matchTan = (parsedObject) => {
    parsedObject.expression = expressions.tanExpression(getExpressionOfIndex(parsedObject, 2));
    return parsedObject;
};

exports.matchCot = (parsedObject) => {
    parsedObject.expression = expressions.cotExpression(getExpressionOfIndex(parsedObject, 2));
    return parsedObject;
};


exports.matchSec = (parsedObject) => {
    parsedObject.expression = expressions.secExpression(getExpressionOfIndex(parsedObject, 2));
    return parsedObject;
};

exports.matchCsc = (parsedObject) => {
    parsedObject.expression = expressions.cscExpression(getExpressionOfIndex(parsedObject, 2));
    return parsedObject;
};

exports.matchLn = (parsedObject) => {
    parsedObject.expression = expressions.lnExpression(getExpressionOfIndex(parsedObject, 2));
    return parsedObject;
};

exports.matchSqrt = (parsedObject) => {
    parsedObject.expression = expressions.sqrtExpression(getExpressionOfIndex(parsedObject, 2));
    return parsedObject;
};