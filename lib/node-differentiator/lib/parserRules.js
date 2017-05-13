const expressions = require('./expressions');
module.exports = {
    unsignedConstantPrimitive: [
        {
            matchRule: [['number', 'terminal']],
            onMatch: expressions.expressionConstant,
        },
        {
            matchRule: [['e', 'terminal']],
            onMatch: expressions.expressionConstant,
        },
    ],
    signedConstantPrimitive: [
        {
            matchRule: [['unsignedConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['+', 'terminal'], ['signedConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionUnaryPlus,
        },
        {
            matchRule: [['-', 'terminal'], ['signedConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionUnaryMinus,
        },
    ],
    unsignedNonConstantPrimitive: [
        {
            matchRule: [['x', 'terminal']],
            onMatch: expressions.expressionX,
        },
        {
            matchRule: [['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: expressions.expressionParanthesizedFunction,
        },
    ],
    signedNonConstantPrimitive: [
        {
            matchRule: [['unsignedNonConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['+', 'terminal'], ['signedNonConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionUnaryPlus,
        },
        {
            matchRule: [['-', 'terminal'], ['signedNonConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionUnaryMinus,
        },
    ],
    /** sine */
    sin : [
        {
            matchRule: [['sin', 'terminal'], ['(', 'terminal'], ['x', 'terminal'], [')', 'terminal']],
            onMatch: expressions.expressionSinX,
        },
        {
            matchRule: [['sin', 'terminal'], ['(', 'terminal'], ['function', 'nonterminal'], [')', 'terminal']],
            onMatch: expressions.expressionSinFx,
        },
    ],
    /** ln */
    ln: [
        {
            matchRule: [['ln', 'terminal'], ['(', 'terminal'], ['x', 'terminal'], [')', 'terminal']],
            onMatch: expressions.expressionLnX,
        },
        {
            matchRule: [['ln', 'terminal'], [['(', 'terminal']], ['function', 'nonterminal'], [[')', 'terminal']]],
            onMatch: expressions.expressionLnFx,
        },
    ],
    sqrt: [
        {
            matchRule: [['sqrt', 'terminal'], ['(', 'terminal'], ['x', 'terminal'], [')', 'terminal']],
            onMatch: expressions.expressionSqrtX,
        },
        {
            matchRule: [['sqrt', 'terminal'], [['(', 'terminal']], ['function', 'nonterminal'], [[')', 'terminal']]],
            onMatch: expressions.expressionSqrtFx,
        },
    ],
    unsignedBasicFunction: [
        {
            matchRule: [['sin', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        // {
        //     matchRule: [['ln', 'nonterminal']],
        //     onMatch: expressions.expressionOneChild,
        // },
        // {
        //     matchRule: [['sqrt', 'nonterminal']],
        //     onMatch: expressions.expressionOneChild,
        // },
    ],
    signedBasicFunction: [
        {
            matchRule: [['unsignedBasicFunction', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['+', 'terminal'], ['signedBasicFunction', 'nonterminal']],
            onMatch: expressions.expressionUnaryPlus,
        },
        {
            matchRule: [['-', 'terminal'], ['signedBasicFunction', 'nonterminal']],
            onMatch: expressions.expressionUnaryMinus,
        },
    ],
    /** rules related to power operator*/
    nonConstantBase: [
        {
            matchRule: [['unsignedBasicFunction', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['unsignedNonConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
    ],
    unsignedCostantPower: [
        {
            matchRule: [['unsignedConstantPrimitive', 'nonterminal'], [['^', 'terminal']], ['signedConstantPower', 'nonterminal']],
            onMatch: expressions.expressionCpowC,
        },
        {
            matchRule: [['unsignedConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
    ],
    signedConstantPower: [
        {
            matchRule: [['unsignedConstantPower', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['+', 'terminal'], ['nonterminal', 'signedConstantPower']],
            onMatch: expressions.expressionUnaryPlus,
        },
        {
            matchRule: [['-', 'terminal'], ['nonterminal', 'signedConstantPower']],
            onMatch: expressions.expressionUnaryMinus,
        },
    ],
    unsignedPolynomialExp: [
        {
            matchRule: [['x', 'terminal'], [['^', 'terminal']], ['signedConstantPower', 'nonterminal']],
            onMatch: expressions.expressionsXPowN,
        },
        {
            matchRule: [['nonConstantBase', 'nonterminal'], [['^', 'terminal']], ['signedConstantPower', 'nonterminal']],
            onMatch: expressions.expressionsFxPowN,
        },
    ],
    unsignedConstantExp: [
        {
            matchRule: [['unsignedConstantPrimitive', 'nonterminal'], [['^', 'terminal']], ['signedConstantPower', 'nonterminal']],
            onMatch: expressions.expressionsCPowC,
        },
    ],
    signedNonConstantPower: [
        {
            matchRule: [['signedExp', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['signedBasicFunction', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['signedNonConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
    ],
    unsignedConstantBaseExp: [
        {
            matchRule: [['e', 'terminal'], [['^', 'terminal']], ['signedNonConstantPower', 'nonterminal']],
            onMatch: expressions.expressionsEPowFx,
        },
        {
            matchRule: [['number', 'terminal'], [['^', 'terminal']], ['nonConstantPower', 'nonterminal']],
            onMatch: expressions.expressionsNumberPowFx,
        },
    ],
    unsignedNonConstantBaseExp: [
        {
            matchRule: [['nonConstantBase', 'nonterminal'], [['^', 'terminal']], ['nonConstantPower', 'nonterminal']],
            onMatch: expressions.expressionFxPowGx,
        }
    ],
    unsignedExp: [
        {
            matchRule: [['unsignedNonConstantBaseExp', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['unsignedConstantBaseExp', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['unsignedPolynomialExp', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['unsignedConstantExp', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        }
    ],
    signedExp: [
        {
            matchRule: [['unsignedExp', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['+', 'terminal'], ['signedExp', 'nonterminal']],
            onMatch: expressions.expressionUnaryPlus,
        },
        {
            matchRule: [['-', 'terminal'], ['signedExp', 'nonterminal']],
            onMatch: expressions.expressionUnaryMinus,
        },
    ],
    /** unsignedFactor */
    factor: [
        {
            matchRule: [['signedNonConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['signedConstantPrimitive', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        {
            matchRule: [['signedBasicFunction', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
        },
        // {
        //     matchRule: [['signedExp', 'nonterminal']],
        //     onMatch: expressions.expressionOneChild,
        // },
    ],

    term: [
        {
            matchRule: [['factor', 'nonterminal'], ['moreFactors', 'nonterminal']],
            onMatch: expressions.expressionTerm,
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

    // function: [
    //     {
    //         matchRule: [['term', 'nonterminal'], ['moreTerms', 'nonterminal']],
    //         onMatch: expressions.expressionFunction,
    //     },
    // ],

    function: [
        {
            matchRule: [['factor', 'nonterminal']],
            onMatch: expressions.expressionOneChild,
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
