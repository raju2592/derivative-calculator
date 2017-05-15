const parserRules = require('./parserRules');

const parse = (startSymbol, parsingArg) => {
    const startPos = 0;
    const isStartSymbol = true;
    const parsedResult = getParsedResult([startSymbol, 'nonterminal'], parsingArg, startPos, isStartSymbol);
    if(parsedResult.parseSuccess) {
        return parsedResult.parsedObject;
    }
    return null;
};

exports.parse = parse;

const getParsedResult = (symbol, parsingArg, startPos, isStartSymbol) => {
    const symbolName = symbol[0];
    const symbolType = symbol[1];
    let parsedResult = {};
    //console.log(symbol + " " + startPos);
    if(symbolName === '_epsilon') {
        // console.log('epsilon call');
        parsedResult = {
            parseSuccess: true,
            endPos: startPos - 1,
            parsedObject: null,
        }
        return parsedResult;
    }
    if(startPos === parsingArg.length && symbolType === 'terminal') {
        return { parseSuccess: false };
    }
    //console.log(symbol);
    if(symbolType === 'terminal') {
        //console.log('terminal ' + symbolName);
        if(parsingArg[startPos].tokenName === symbolName) {
            parsedResult.parsedObject = parsingArg[startPos];
            parsedResult.endPos = startPos;
            parsedResult.parseSuccess = true;
        } else {
            parsedResult.parseSuccess = false;
        }
        return parsedResult;
    }
    //console.log(symbol);
    const relevantRules = parserRules[symbolName];
    //console.log(symbolName, parserRules[symbolName]);
    for(let i = 0; i < relevantRules.length; i++) {
        //if(symbolName == 'moreFactors' && startPos == 3) console.log(rule);
        const rule = relevantRules[i];
        //if(symbolName == 'moreFactors' && startPos == 3) console.log(rule);
        //console.log(rule.matchRule);
        const matchRule = relevantRules[i].matchRule;
        const onMatch = relevantRules[i].matchRule.onMatch;
        const ruleMatch = match(matchRule, parsingArg, startPos);
        //if(symbolName =='term') console.log(ruleMatch);
        if(ruleMatch.parseSuccess) {
            if(isStartSymbol && ruleMatch.endPos !== parsingArg.length - 1) {
                continue;
            }
            let parsedObject = {
                parseTree: ruleMatch.parseTree,
                rule: matchRule, 
            };
            // if(isStartSymbol) {
            //     console.log(parsedObject.parseTree[1]);
            //     console.log(rule);
            // }
            
            if(rule.onMatch) parsedObject = rule.onMatch(parsedObject);
            return {
                parsedObject,
                endPos: ruleMatch.endPos,
                parseSuccess: true,
            }
        }
        //if(symbolName =='term') console.log(ruleMatch);
    }
    return { parseSuccess: false };
}

const match = (rule, parsingArg, startPos) => {
    //console.log(rule + ' ' + startPos);
    let curPos = startPos, parseSuccess = true;
    const parseTree = [];
    for(let i = 0; i < rule.length; i++) {
        const parsedChild = getParsedResult(rule[i], parsingArg, curPos);
        if(parsedChild.parseSuccess) {
            parseTree.push(parsedChild.parsedObject);
            curPos = parsedChild.endPos + 1;
        } else {
            parseSuccess = false;
            break;
        }
    }
    if(parseSuccess) {
        return {
            parseTree,
            parseSuccess,
            endPos: curPos -1,
        }
    }
    return { parseSuccess };
};
