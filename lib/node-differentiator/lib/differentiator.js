const _ = require('lodash');
const lexer = require('./lexer');
const parser = require('./parser');

const addMathJaxQuote = (mathString) => {
    return '`' + mathString + '`';
}

const getStory = (derivative) => {
    let story = [];
    const startingText = [
        'We know that, ',
        'It is the case that, ',
        'Remember that, ',
    ][Math.floor(Math.random() * 3)];
    const moreStartingText = [
        'We also know that, ',
        'It is also the case that, ',
        'Also, Remember that, ',
    ][Math.floor(Math.random() * 3)];
    const derivativeRules = derivative.rules.map((rule) => addMathJaxQuote(rule));
    const derivativeExpression = derivative.expressionDerivative;
    const ownStory =  [];
    ownStory.push(startingText + derivativeRules[0] + '.');
    if(derivative.rules.length === 2) {
        ownStory.push(moreStartingText + derivativeRules[1] + '.');
    }
    const appliedRule = derivative.appliedRule;
    if(appliedRule) {
        ownStory.push('So, ' + addMathJaxQuote(derivativeExpression.toString() + ' = ' + appliedRule.toString()) + '.');
    }
    story = story.concat(ownStory);
    if(derivative.childDerivatives) {
        const childDerivatives = _.uniqBy(derivative.childDerivatives,
            (derivative) => derivative.expressionDerivative.argument.toString());
        const childStory = childDerivatives
            .map((childDerivative) => getStory(childDerivative))
            .reduce((a, b) => a.concat(b), []);
        story = story.concat(childStory);
        let finalResultText = [];
        if(derivativeRules.length === 2) {
            finalResultText = [
                'So, by the rules, ' + derivativeRules[0] + ',',
                'And, ' +  derivativeRules[1] + ',',
                addMathJaxQuote(derivativeExpression.toString() + ' = ' + derivative.result.toString()),
            ]
        } else {
            finalResultText = [
                'So, by the rule, ' + derivativeRules[0] + ',',
                addMathJaxQuote(derivativeExpression.toString() + ' = ' + derivative.result.toString()),
            ]
        }
        story = story.concat(finalResultText);
    }
    return story;
}

const getDerivative = (inputFunction) => {
    let tokenStream = lexer.getLexemes(inputFunction);
    if(!tokenStream) {
        return {status: 'failure'};
    }
    tokenStream = tokenStream.filter((token) => token.tokenName !== 'whitespace');
    const parsedObject = parser.parse('function', tokenStream);
    if(!parsedObject) {
        return {status: 'failure'};
    }
    expression = parsedObject.expression;
    const derivative = expression.derivative();
    const result = addMathJaxQuote(derivative.expressionDerivative + ' = ' + derivative.result.toString());
    const story = getStory(derivative);
    return {
        status: 'success',
        result,
        story,
    }
}
exports.getDerivative = getDerivative;

//console.log(getDerivative('10 * (x + tan(x))'));