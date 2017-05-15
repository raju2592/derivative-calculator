const lexer = require('./lexer');
const lexerRules = require('./lexerRules');
const parser = require('./parser');

//const tokenStream = lexer(lexerRules).getLexemes('sin(sin(x))');
//const parsedObject = parser.parse('factor', tokenStream);
//const derivative = parsedObject.derivative();
//console.log(derivative.result);

const addMathJaxQuote = (mathString) => {
    return '`' + mathString + '`';
}

const getStory = (derivative) => {
    if(!derivative.rule) return getStory(derivative.childDerivatives[0]);
    let story = [];
    const startingText = [
        'We know that, ',
        'It is the case that, ',
        'Remember that, ',
    ][Math.floor(Math.random() * 3)];
    let ownStory = startingText + addMathJaxQuote(derivative.rule) + '.';
    if(derivative.appliedRule) {
        ownStory += '. So, ' + addMathJaxQuote('d/dx ' + derivative.function + '=' +  derivative.appliedRule);
    }
    story.push(ownStory);
    if(derivative.childDerivatives) {
        const childStory = derivative.childDerivatives
            .map((childDerivative) => getStory(childDerivative))
            .reduce((a, b) => a.concat(b), []);
        story = story.concat(childStory);
        const finalResultText = 'So by the rule ' + 
            addMathJaxQuote(derivative.rule) + ',' +  
            addMathJaxQuote('d/dx' + derivative.function + '=' + derivative.result);
        story.push(finalResultText);
    }
    return story;
}

// const story = getStory(derivative);
// story.forEach((s) => console.log(s));

const getDerivative = (inputFunction) => {
    const tokenStream = lexer(lexerRules).getLexemes(inputFunction);
    //console.log(tokenStream);
    const parsedObject = parser.parse('term', tokenStream);
    //console.log(parsedObject.parseTree[2].derivative());
    const derivative = parsedObject.derivative();
    const result = addMathJaxQuote(derivative.result);
    const story = getStory(derivative);
    return {
        result,
        story,
    }
}
exports.getDerivative = getDerivative;

console.log(getDerivative('x*x*x'));