const matchHandlers = require('./matchHandlers');
module.exports = {
    unsignedConstantPrimitive: [
        {
            matchRule: [['number', 'terminal']],
            onMatch: matchHandlers.matchConstant,
        },
        {
            matchRule: [['e', 'terminal']],
            onMatch: matchHandlers.matchConstant,
        },
    ],
    signedConstantPrimitive: [
        {
            matchRule: [['unsignedConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['+', 'terminal'], ['signedConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchUnaryPlus,
        },
        {
            matchRule: [['-', 'terminal'], ['signedConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchUnaryMinus,
        },
    ],
    unsignedNonConstantPrimitive: [
        {
            matchRule: [['x', 'terminal']],
            onMatch: matchHandlers.matchX,
        },
        {
            matchRule: [['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: matchHandlers.matchParanthesizedFunction,
        },
    ],
    signedNonConstantPrimitive: [
        {
            matchRule: [['unsignedNonConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['+', 'terminal'], ['signedNonConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchUnaryPlus,
        },
        {
            matchRule: [['-', 'terminal'], ['signedNonConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchUnaryMinus,
        },
    ],
    sin : [
        {
            matchRule: [['sin', 'terminal'], ['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: matchHandlers.matchSin,
        },
    ],
    cos : [
        {
            matchRule: [['cos', 'terminal'], ['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: matchHandlers.matchCos,
        },
    ],
    tan : [
        {
            matchRule: [['tan', 'terminal'], ['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: matchHandlers.matchTan,
        },
    ],
    cot : [
        {
            matchRule: [['cot', 'terminal'], ['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: matchHandlers.matchCot,
        },
    ],
    sec : [
        {
            matchRule: [['sec', 'terminal'], ['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: matchHandlers.matchSec,
        },
    ],
    cosec : [
        {
            matchRule: [['cosec', 'terminal'], ['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: matchHandlers.matchCosec,
        },
    ],
    ln: [
        {
            matchRule: [['ln', 'terminal'], ['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: matchHandlers.matchLn,
        },
    ],
    sqrt: [
        {
            matchRule: [['sqrt', 'terminal'], ['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: matchHandlers.matchSqrt,
        },
    ],
    unsignedBasicFunction: [
        {
            matchRule: [['sin', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['cos', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['tan', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['cot', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['sec', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['cosec', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['ln', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['sqrt', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
    ],
    signedBasicFunction: [
        {
            matchRule: [['unsignedBasicFunction', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['+', 'terminal'], ['signedBasicFunction', 'nonterminal']],
            onMatch: matchHandlers.matchUnaryPlus,
        },
        {
            matchRule: [['-', 'terminal'], ['signedBasicFunction', 'nonterminal']],
            onMatch: matchHandlers.matchUnaryMinus,
        },
    ],
    /** rules related to power operator*/
    nonConstantBase: [
        {
            matchRule: [['unsignedBasicFunction', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['unsignedNonConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
    ],
    unsignedConstantPower: [
        {
            matchRule: [['unsignedConstantExponential', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['unsignedConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
    ],
    signedConstantPower: [
        {
            matchRule: [['unsignedConstantPower', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['+', 'terminal'], ['signedConstantPower', 'nonterminal']],
            onMatch: matchHandlers.matchUnaryPlus,
        },
        {
            matchRule: [['-', 'terminal'], ['signedConstantPower', 'nonterminal']],
            onMatch: matchHandlers.matchUnaryMinus,
        },
    ],
    unsignedConstantPowerExponential: [
        {
            matchRule: [['nonConstantBase', 'nonterminal'], ['^', 'terminal'], ['signedConstantPower', 'nonterminal']],
            onMatch: matchHandlers.matchConstantPowerExponential,
        },
    ],
    unsignedConstantExponential: [
        {
            matchRule: [['unsignedConstantPrimitive', 'nonterminal'], ['^', 'terminal'], ['signedConstantPower', 'nonterminal']],
            onMatch: matchHandlers.matchConstantExponential,
        },
    ],
    signedNonConstantPower: [
        {
            matchRule: [['signedExp', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['signedBasicFunction', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['signedNonConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
    ],
    unsignedConstantBaseExponential: [
        // {
        //     matchRule: [['e', 'terminal'], [['^', 'terminal']], ['signedNonConstantPower', 'nonterminal']],
        //     onMatch: matchHandlers.matchHandlersEPowFx,
        // },
        {
            matchRule: [['unsignedConstantPrimitive', 'nonterminal'], ['^', 'terminal'], ['signedNonConstantPower', 'nonterminal']],
            onMatch: matchHandlers.matchConstantBaseExponential,
        },
    ],
    unsignedGeneralExponential: [
        {
            matchRule: [['nonConstantBase', 'nonterminal'], ['^', 'terminal'], ['signedNonConstantPower', 'nonterminal']],
            onMatch: matchHandlers.matchGeneralExponential,
        }
    ],
    unsignedExp: [
        {
            matchRule: [['unsignedGeneralExponential', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['unsignedConstantBaseExponential', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['unsignedConstantPowerExponential', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['unsignedConstantExponential', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        }
    ],
    signedExp: [
        {
            matchRule: [['unsignedExp', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['+', 'terminal'], ['signedExp', 'nonterminal']],
            onMatch: matchHandlers.matchUnaryPlus,
        },
        {
            matchRule: [['-', 'terminal'], ['signedExp', 'nonterminal']],
            onMatch: matchHandlers.matchUnaryMinus,
        },
    ],
    /** unsignedFactor */
    factor: [
        {
            matchRule: [['signedExp', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['signedNonConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['signedConstantPrimitive', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
        {
            matchRule: [['signedBasicFunction', 'nonterminal']],
            onMatch: matchHandlers.matchOneChild,
        },
    ],

    term: [
        {
            matchRule: [['factor', 'nonterminal'], ['moreFactors', 'nonterminal']],
            onMatch: matchHandlers.matchTerm,
        },
    ],

    moreFactors: [
        {
            matchRule: [['*', 'terminal'], ['factor', 'nonterminal'], ['moreFactors', 'nonterminal']],
        },
        {
            matchRule: [['/', 'terminal'], ['factor', 'nonterminal'], ['moreFactors', 'nonterminal']],
        },
        {
            matchRule: [['_epsilon', 'terminal']],
        },
    ],

    function: [
        {
            matchRule: [['term', 'nonterminal'], ['moreTerms', 'nonterminal']],
            onMatch: matchHandlers.matchFunction,
        },
    ],

    moreTerms: [
        {
            matchRule: [['+', 'terminal'], ['term', 'nonterminal'], ['moreTerms', 'nonterminal']],
        },
        {
            matchRule: [['-', 'terminal'], ['term', 'nonterminal'], ['moreTerms', 'nonterminal']],
        },
        {
            matchRule: [['_epsilon', 'terminal']],
        },
    ],
}
