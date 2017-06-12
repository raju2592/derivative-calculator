const expressionTypes = require('./expressionTypes');

const chainRule = 'dy/dx = dy/(du)(du)/dx';

const parenthesize = function(argument) {
    return '(' + argument + ')';
};

const binaryIsConstant = function() {
    if(this.argLeft.isConstant() && this.argRight.isConstant()) return true;
    return false;
};

const unaryIsConstant = function() {
    if(this.argument.isConstant()) return true;
    return false;
};

const exponentialIsConstant = function() {
    if(this.base.isConstant() && this.power.isConstant()) return true;
    return false;
};

const derivativeToString = function() {
    const expressionType = this.expressionType;
    const argumentExpressionType = this.argument.expressionType;
    if((argumentExpressionType.arity === 2 && expressionType.precedence < argumentExpressionType.precedence)
        || argumentExpressionType === expressionTypes.unaryMinusExpression) {
        return 'd/dx ' + '(' + this.argument.toString() + ')'
    } 
    return 'd/dx ' + this.argument.toString();
};

const derivativeExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.derivativeExpression,
        toString: derivativeToString,
    };
    return ret;
};

const returnArgument = function() {
    return this.argument;
};

const constantDerivative = function() {
    return {
        expressionDerivative: derivativeExpression(this),
        rules: ['d/dx c = 0'],
        appliedRule: constantExpression('0'),
        childDerivatives: null,
        result: constantExpression('0'),
    }
};

const constantExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.constantExpression,
        toString: returnArgument,
        derivative: constantDerivative,
        isConstant: () => true,
    };
    return ret;
}

exports.constantExpression = constantExpression;

const returnX = function() {
    return 'x';
};

const variableDerivative = function() {
    return {
        expressionDerivative: derivativeExpression(this),
        rules: ['d/dx x = 1'],
        appliedRule: null,
        childDerivatives: null,
        result: constantExpression('1'),
    }
};

const variableExpression = () => {
    const ret = {
        expressionType: expressionTypes.variableExpression,
        toString: returnX,
        derivative: variableDerivative,
        isConstant: () => false,
    };
    return ret;
}

exports.variableExpression = variableExpression;

const unaryMinusToString = function() {
    const expressionType = this.expressionType;
    const argumentExpressionType = this.argument.expressionType;
    if((expressionType.arity === 2 && expressionType.precedence < argumentExpressionType.precedence)
        || argumentExpressionType === expressionTypes.unaryMinusExpression) {
        return '-' + parenthesize(this.argument.toString());
    } 
    return '-' + this.argument.toString();
}

const unaryMinusDerivative = function() {
    const unaryMinusDerivativeRule = 'd/dx (-f(x)) = - d/dx f(x)';
    const expressionDerivative = derivativeExpression(this); 
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    const argument = this.argument;
    const argumentDerivative = argument.derivative();
    const rules = [unaryMinusDerivativeRule];
    const appliedRule = unaryMinusExpression(derivativeExpression(argument));
    const result = unaryMinusExpression(argumentDerivative.result);
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [argumentDerivative],
        result,
    };
};

const unaryMinusExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.unaryMinusExpression,
        toString: unaryMinusToString,
        derivative: unaryMinusDerivative,
        isConstant: unaryIsConstant,
    };
    return ret;
}

exports.unaryMinusExpression = unaryMinusExpression;

const additionToString = function() {
    let leftArgString;
    const expressionType = this.expressionType;
    const leftArgExpressionType = this.argLeft.expressionType;
    const rightArgExpressionType = this.argRight.expressionType;
    if(expressionType.precedence < leftArgExpressionType.precedence
        || leftArgExpressionType === expressionTypes.unaryMinusExpression) {
        leftArgString = parenthesize(this.argLeft.toString());
    } else leftArgString = this.argLeft.toString();
    let rightArgString;
    if((rightArgExpressionType.arity === 2 && expressionType.precedence < rightArgExpressionType.precedence)
        || rightArgExpressionType === expressionTypes.unaryMinusExpression) {
        rightArgString = parenthesize(this.argRight.toString());
    } else rightArgString = this.argRight.toString();
    return leftArgString + ' + ' + rightArgString;
};

const additionDerivative = function() {
    const additionDerivativeRule = 'd/dx (f(x) + g(x)) = d/dx f(x) + d/dx g(x)';
    const expressionDerivative = derivativeExpression(this);
    const leftArgument = this.argLeft;
    const rightArgument = this.argRight;
    const leftArgumentDerivative = leftArgument.derivative();
    const rightArgumentDerivative = rightArgument.derivative();
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    const rules = [additionDerivativeRule];
    const appliedRule = additionExpression(
        derivativeExpression(leftArgument), derivativeExpression(rightArgument)
    );
    const result = additionExpression(
        leftArgumentDerivative.result, rightArgumentDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [leftArgumentDerivative, rightArgumentDerivative],
        result,
    };
};

const additionExpression = function(argLeft, argRight) {
    const ret = {
        argLeft,
        argRight,
        expressionType: expressionTypes.additionExpression,
        toString: additionToString,
        derivative: additionDerivative,
        isConstant: binaryIsConstant,
    }
    return ret;
}

exports.additionExpression = additionExpression;

const subtractionToString = function() {
    let leftArgString;
    const expressionType = this.expressionType;
    const leftArgExpressionType = this.argLeft.expressionType;
    const rightArgExpressionType = this.argRight.expressionType;
    if(expressionType.precedence < leftArgExpressionType.precedence
        || leftArgExpressionType === expressionTypes.unaryMinusExpression) {
        leftArgString = parenthesize(this.argLeft.toString());
    } else leftArgString = this.argLeft.toString();
    let rightArgString;
    if((rightArgExpressionType.arity === 2 && expressionType.precedence <= rightArgExpressionType.precedence)
        || rightArgExpressionType === expressionTypes.unaryMinusExpression) {
        rightArgString = parenthesize(this.argRight.toString());
    } else rightArgString = this.argRight.toString();
    return leftArgString + ' - ' + rightArgString;
};

const subtractionDerivative = function() {
    const subtractionDerivativeRule = 'd/dx (f(x) - g(x)) = d/dx f(x) - d/dx g(x)';
    const expressionDerivative = derivativeExpression(this);
    const leftArgument = this.argLeft;
    const rightArgument = this.argRight;
    const leftArgumentDerivative = leftArgument.derivative();
    const rightArgumentDerivative = rightArgument.derivative();
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    const rules = [subtractionDerivativeRule];
    const appliedRule = subtractionExpression(
        derivativeExpression(leftArgument), derivativeExpression(rightArgument)
    );
    const result = subtractionExpression(
        leftArgumentDerivative.result, rightArgumentDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [leftArgumentDerivative, rightArgumentDerivative],
        result,
    };
};

const subtractionExpression = function(argLeft, argRight) {
    const ret = {
        argLeft,
        argRight,
        expressionType: expressionTypes.subtractionExpression,
        toString: subtractionToString,
        derivative: subtractionDerivative,
        isConstant: binaryIsConstant,
    }
    return ret;
}

exports.subtractionExpression = subtractionExpression;


const multiplicationToString = function() {
    let leftArgString;
    const expressionType = this.expressionType;
    const leftArgExpressionType = this.argLeft.expressionType;
    const rightArgExpressionType = this.argRight.expressionType;
    if(expressionType.precedence < leftArgExpressionType.precedence
        || leftArgExpressionType === expressionTypes.unaryMinusExpression) {
        leftArgString = parenthesize(this.argLeft.toString());
    } else leftArgString = this.argLeft.toString();
    let rightArgString;
    if(rightArgExpressionType.arity === 2 && expressionType.precedence < rightArgExpressionType.precedence) {
        rightArgString = parenthesize(this.argRight.toString());
    } else rightArgString = this.argRight.toString();
    return leftArgString + '*' + rightArgString;
};


const multiplicationDerivative = function() {
    const multiplicationDerivativeRule = 'd/dx f(x)g(x) = f(x) d/dx g(x) + g(x) d/dx f(x)';
    const constantMultiplicationRule = 'd/dx cf(x) = c d/dx f(x)';
    const expressionDerivative = derivativeExpression(this);
    const leftArgument = this.argLeft;
    const rightArgument = this.argRight;
    const leftArgumentDerivative = leftArgument.derivative();
    const rightArgumentDerivative = rightArgument.derivative();
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.argLeft.isConstant()) {
        return {
            expressionDerivative,
            rules: [constantMultiplicationRule],
            appliedRule: multiplicationExpression(
                this.argLeft, derivativeExpression(this.argRight)
            ),
            childDerivatives: [rightArgumentDerivative],
            result: multiplicationExpression(
                this.argLeft, rightArgumentDerivative.result
            ),
        } 
    }
    if(this.argRight.isConstant()) {
        return {
            expressionDerivative,
            rules: [constantMultiplicationRule],
            appliedRule: multiplicationExpression(
                this.argRight, derivativeExpression(this.argLeft)
            ),
            childDerivatives: [leftArgumentDerivative],
            result: multiplicationExpression(
                this.argRight, leftArgumentDerivative.result
            ),
        } 
    }
    const rules = [multiplicationDerivativeRule];
    const appliedRule = additionExpression(
        multiplicationExpression(
            leftArgument, derivativeExpression(rightArgument)
        ),
        multiplicationExpression(
            rightArgument, derivativeExpression(leftArgument)
        )
    );
    const result = additionExpression(
        multiplicationExpression(
            leftArgument, rightArgumentDerivative.result
        ),
        multiplicationExpression(
            rightArgument, leftArgumentDerivative.result
        )
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [leftArgumentDerivative, rightArgumentDerivative],
        result,
    };
};

const multiplicationExpression = function(argLeft, argRight) {
    const ret = {
        argLeft,
        argRight,
        expressionType: expressionTypes.multiplicationExpression,
        toString: multiplicationToString,
        derivative: multiplicationDerivative,
        isConstant: binaryIsConstant,
    }
    return ret;
};

exports.multiplicationExpression = multiplicationExpression;

const divisionToString = function() {
    let leftArgString;
    const expressionType = this.expressionType;
    const leftArgExpressionType = this.argLeft.expressionType;
    const rightArgExpressionType = this.argRight.expressionType;
    if(expressionType.precedence <= leftArgExpressionType.precedence ||
        leftArgExpressionType === expressionTypes.divisionExpression) {
        leftArgString = parenthesize(this.argLeft.toString());
    } else leftArgString = this.argLeft.toString();
    let rightArgString;
    if((rightArgExpressionType.arity === 2 && expressionType.precedence <= rightArgExpressionType.precedence) ||
        rightArgExpressionType === expressionTypes.divisionExpression) {
        rightArgString = parenthesize(this.argRight.toString());
    } else rightArgString = this.argRight.toString();
    return leftArgString + '/' + rightArgString;
};

const divisionDerivative = function() {
    const divisionDerivativeRule = 'd/dx f(x)/g(x) = (g(x) d/dx f(x) - f(x) d/dx g(x))/(g(x))^2';
    const constantMultiplicationRule = 'd/dx cf(x) = c d/dx f(x)';
    const expressionDerivative = derivativeExpression(this);
    const leftArgument = this.argLeft;
    const rightArgument = this.argRight;
    const leftArgumentDerivative = leftArgument.derivative();
    const rightArgumentDerivative = rightArgument.derivative();
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.argRight.isConstant()) {
        return {
            expressionDerivative,
            rules: [constantMultiplicationRule],
            appliedRule: multiplicationExpression(
                divisionExpression(constantExpression('1'), this.argRight),
                derivativeExpression(this.argLeft)
            ),
            childDerivatives: [leftArgumentDerivative],
            result: multiplicationExpression(
                divisionExpression(constantExpression('1'), this.argRight),
                leftArgumentDerivative.result
            ),
        } 
    }
    const rules = [divisionDerivativeRule];
    const appliedRule = divisionExpression(
        subtractionExpression(
            multiplicationExpression(rightArgument, derivativeExpression(leftArgument)),
            multiplicationExpression(leftArgument, derivativeExpression(rightArgument))
        ),
        constantPowerExponentialExpression(rightArgument, constantExpression('2'))
    );
    const result = divisionExpression(
        subtractionExpression(
            multiplicationExpression(rightArgument, leftArgumentDerivative.result),
            multiplicationExpression(leftArgument, rightArgumentDerivative.result)
        ),
        constantPowerExponentialExpression(rightArgument, constantExpression('2'))
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [leftArgumentDerivative, rightArgumentDerivative],
        result,
    };
};

const divisionExpression = function(argLeft, argRight) {
    const ret = {
        argLeft,
        argRight,
        expressionType: expressionTypes.divisionExpression,
        toString: divisionToString,
        derivative: divisionDerivative,
        isConstant: binaryIsConstant,
    }
    return ret;
};

exports.divisionExpression = divisionExpression;

const exponentialToString = function() {
    const baseExpressionType = this.base.expressionType;
    const powerExpressionType = this.power.expressionType;
    const expressionType = this.expressionType;
    let baseToString;
    if(expressionType.precedence <= baseExpressionType.precedence
        || baseExpressionType === expressionTypes.basicFunctionExpression
        || baseExpressionType === expressionTypes.unaryMinusExpression) {
        baseToString = parenthesize(this.base.toString());
    } else baseToString = this.base.toString();
    let powerToString;
    if((powerExpressionType.arity === 2 && expressionType.precedence <= powerExpressionType.precedence)
        || baseExpressionType === expressionTypes.unaryMinusExpression){
        powerToString = parenthesize(this.power.toString());
    } else powerToString = this.power.toString();
    return baseToString + '^' + powerToString;
};

const constantExponentialExpression = (base, power) => {
    const ret = {
        base,
        power,
        expressionType: expressionTypes.constantExponentialExpression,
        toString: exponentialToString,
        derivative: constantDerivative,
        isConstant: () => true,
    };
    return ret;
}

exports.constantExponentialExpression = constantExponentialExpression;

const constantPowerExponentialDerivative = function() {
    const constantPowerDerivativeRule = 'd/dx x^n = n*x^(n-1)';
    const expressionDerivative = derivativeExpression(this);
    const baseDerivative = this.base.derivative();
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.base.expressionType === expressionTypes.variableExpression) {
        return {
            expressionDerivative,
            rules: [constantPowerDerivativeRule],
            appliedRule: multiplicationExpression(
                this.power,
                constantPowerExponentialExpression(
                    variableExpression(),
                    subtractionExpression(this.power, constantExpression('1'))
                )
            ),
            childDerivatives: null,
            result: multiplicationExpression(
                this.power,
                constantPowerExponentialExpression(
                    variableExpression(),
                    subtractionExpression(this.power, constantExpression('1'))
                )
            ),
        } 
    }
    const rules = [constantPowerDerivativeRule, chainRule];
    const appliedRule = multiplicationExpression(
        multiplicationExpression(
            this.power,
            constantPowerExponentialExpression(
                this.base,
                subtractionExpression(this.power, constantExpression('1'))
            )
        ),
        derivativeExpression(this.base)
    );

    const result = multiplicationExpression(
        multiplicationExpression(
            this.power,
            constantPowerExponentialExpression(
                this.base,
                subtractionExpression(this.power, constantExpression('1'))
            )
        ),
        baseDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [baseDerivative],
        result,
    };
};

const constantPowerExponentialExpression = (base, power) => {
    const ret = {
        base,
        power,
        expressionType: expressionTypes.constantPowerExponentialExpression,
        toString: exponentialToString,
        derivative: constantPowerExponentialDerivative,
        isConstant: exponentialIsConstant,
    };
    return ret;
}

exports.constantPowerExponentialExpression = constantPowerExponentialExpression;

const constantBaseExponentialDerivative = function() {
    const ePowerXDerivativeRule = 'd/dx e^x = e^x';
    const aPowerXDerivativeRule = 'd/dx a^x = a^x * ln(a)';
    const expressionDerivative = derivativeExpression(this);
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.power.expressionType === expressionTypes.variableExpression) {
        if(this.base.toString() === 'e') {
            return {
                expressionDerivative,
                rules: [ePowerXDerivativeRule],
                appliedRule: null,
                childDerivatives: null,
                result: this,
            }
        } else {
            return {
                expressionDerivative,
                rules: [aPowerXDerivativeRule],
                appliedRule: multiplicationExpression(
                    this, lnExpression(this.base)
                ),
                childDerivatives: null,
                result: multiplicationExpression(
                    this, lnExpression(this.base)
                ),
            }
        }
    }
    const powerDerivative = this.power.derivative();
    if(this.base.toString() === 'e') {
        const rules = [ePowerXDerivativeRule, chainRule];
        const appliedRule = multiplicationExpression(
            this, derivativeExpression(this.power)
        );

        const result = multiplicationExpression(
            this, powerDerivative.result
        );
        return {
            expressionDerivative,
            rules,
            appliedRule,
            childDerivatives: [powerDerivative],
            result,
        };
    } else {
        const rules = [aPowerXDerivativeRule, chainRule];
        const appliedRule = multiplicationExpression(
            multiplicationExpression(this, lnExpression(this.base)),
            derivativeExpression(this.power)
        );
        const result = multiplicationExpression(
            multiplicationExpression(this, lnExpression(this.base)),
            powerDerivative.result
        );
        return {
            expressionDerivative,
            rules,
            appliedRule,
            childDerivatives: [powerDerivative],
            result,
        };
    }
}

const constantBaseExponentialExpression = (base, power) => {
    const ret = {
        base,
        power,
        expressionType: expressionTypes.constantBaseExponentialExpression,
        toString: exponentialToString,
        derivative: constantBaseExponentialDerivative,
        isConstant: exponentialIsConstant,
    };
    return ret;
}

exports.constantBaseExponentialExpression = constantBaseExponentialExpression;

const generalExponentialDerivative = function() {
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.base.isConstant()) {
        return constantBaseExponentialDerivative.call(this);
    }
    if(this.power.isConstant()) {
        return constantPowerExponentialDerivative.call(this);
    }
    const base = this.base;
    const power = this.power;
    const baseDerivative = base.derivative();
    const powerDerivative = power.derivative();
    const generalExponentialDerivativeRule = 'd/dx u ^ v = u ^ v * (ln (u) * d/dx v + (v * d/dx u)/ u)'
    const rules = [generalExponentialDerivativeRule];
    const appliedRule = multiplicationExpression(
        this,
        additionExpression(
            multiplicationExpression(lnExpression(base), derivativeExpression(power)),
            divisionExpression(
                multiplicationExpression(power, derivativeExpression(base)),
                base
            )      
        )
    );
    const result = multiplicationExpression(
        this,
        additionExpression(
            multiplicationExpression(lnExpression(base), powerDerivative.result),
            divisionExpression(
                multiplicationExpression(power, baseDerivative.result),
                base
            )      
        )
    );
    return {
        expressionDerivative: derivativeExpression(this),
        rules,
        appliedRule,
        childDerivatives: [baseDerivative, powerDerivative],
        result,
    };
};

const generalExponentialExpression = (base, power) => {
    const ret = {
        base,
        power,
        expressionType: expressionTypes.generalExponentialExpression,
        toString: exponentialToString,
        derivative: generalExponentialDerivative,
        isConstant: exponentialIsConstant,
    };
    return ret;
}

exports.generalExponentialExpression = generalExponentialExpression;

const lnExpressionToString = function() {
    return 'ln' + '(' + this.argument.toString() + ')'
};

const lnExpressionDerivative = function() {
    const lnDerivativeRule = 'd/dx ln(x) = 1/x';
    const expressionDerivative = derivativeExpression(this); 
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.argument.expressionType === expressionTypes.variableExpression) {
        return {
            expressionDerivative,
            rules: [lnDerivativeRule],
            appliedRule: null,
            childDerivatives: null,
            result: divisionExpression(constantExpression('1'), this.argument),
        } 
    }
    const argument = this.argument;
    const argumentDerivative = argument.derivative();
    const rules = [lnDerivativeRule, chainRule];
    const appliedRule = multiplicationExpression(
        divisionExpression(constantExpression('1'), this.argument),
        derivativeExpression(argument)
    );
    const result = multiplicationExpression(
        divisionExpression(constantExpression('1'), this.argument),
        argumentDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [argumentDerivative],
        result,
    };
};

const lnExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.basicFunctionExpression,
        toString: lnExpressionToString,
        derivative: lnExpressionDerivative,
        isConstant: unaryIsConstant,
    };
    return ret;
}

exports.lnExpression = lnExpression;

const sqrtExpressionToString = function() {
    return 'sqrt' + '(' + this.argument.toString() + ')'
};

const sqrtExpressionDerivative = function() {
    const sqrtDerivativeRule = 'd/dx sqrt(x) = 1/(2*sqrt(x))';
    const expressionDerivative = derivativeExpression(this); 
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.argument.expressionType === expressionTypes.variableExpression) {
        return {
            expressionDerivative,
            rules: [sqrtDerivativeRule],
            appliedRule: null,
            childDerivatives: null,
            result: divisionExpression(
                constantExpression('1'),
                multiplicationExpression(constantExpression('2'), this)
            )
        } 
    }
    const argument = this.argument;
    const argumentDerivative = argument.derivative();
    const rules = [sqrtDerivativeRule, chainRule];
    const appliedRule = multiplicationExpression(
        divisionExpression(
            constantExpression('1'),
            multiplicationExpression(constantExpression('2'), this)
        ),
        derivativeExpression(argument)
    );
    console.log(appliedRule.argRight);
    const result = multiplicationExpression(
        divisionExpression(
            constantExpression('1'),
            multiplicationExpression(constantExpression('2'), this)
        ),
        argumentDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [argumentDerivative],
        result,
    };
};

const sqrtExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.basicFunctionExpression,
        toString: sqrtExpressionToString,
        derivative: sqrtExpressionDerivative,
        isConstant: unaryIsConstant,
    };
    return ret;
}

exports.sqrtExpression = sqrtExpression;

const sinExpressionToString = function() {
    return 'sin' + '(' + this.argument.toString() + ')'
};

const sinExpressionDerivative = function() {
    const sinDerivativeRule = 'd/dx sin(x) = cos(x)';
    const expressionDerivative = derivativeExpression(this); 
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.argument.expressionType === expressionTypes.variableExpression) {
        return {
            expressionDerivative,
            rules: [sinDerivativeRule],
            appliedRule: null,
            childDerivatives: null,
            result: cosExpression(this.argument),
        } 
    }
    const argument = this.argument;
    const argumentDerivative = argument.derivative();
    const rules = [sinDerivativeRule, chainRule];
    const appliedRule = multiplicationExpression(
        cosExpression(argument),
        derivativeExpression(argument)
    );
    const result = multiplicationExpression(
        cosExpression(argument),
        argumentDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [argumentDerivative],
        result,
    };
};

const sinExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.basicFunctionExpression,
        toString: sinExpressionToString,
        derivative: sinExpressionDerivative,
        isConstant: unaryIsConstant,
    };
    return ret;
}

exports.sinExpression = sinExpression;

const cosExpressionToString = function() {
    return 'cos' + '(' + this.argument.toString() + ')'
};

const cosExpressionDerivative = function() {
    const cosDerivativeRule = 'd/dx cos(x) = - sin(x)';
    const expressionDerivative = derivativeExpression(this); 
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.argument.expressionType === expressionTypes.variableExpression) {
        return {
            expressionDerivative,
            rules: [cosDerivativeRule],
            appliedRule: null,
            childDerivatives: null,
            result: unaryMinusExpression(sinExpression(this.argument)),
        } 
    }
    const argument = this.argument;
    const argumentDerivative = argument.derivative();
    const rules = [cosDerivativeRule, chainRule];
    const appliedRule = multiplicationExpression(
        unaryMinusExpression(sinExpression(this.argument)),
        derivativeExpression(argument)
    );
    const result = multiplicationExpression(
        unaryMinusExpression(sinExpression(this.argument)),
        argumentDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [argumentDerivative],
        result,
    };
};

const cosExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.basicFunctionExpression,
        toString: cosExpressionToString,
        derivative: cosExpressionDerivative,
        isConstant: unaryIsConstant,
    };
    return ret;
}

exports.cosExpression = cosExpression;

const tanExpressionToString = function() {
    return 'tan' + '(' + this.argument.toString() + ')'
};

const tanExpressionDerivative = function() {
    const tanDerivativeRule = 'd/dx tan(x) = sec^2(x)';
    const expressionDerivative = derivativeExpression(this); 
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.argument.expressionType === expressionTypes.variableExpression) {
        return {
            expressionDerivative,
            rules: [tanDerivativeRule],
            appliedRule: null,
            childDerivatives: null,
            result: constantPowerExponentialExpression(
                secExpression(this.argument), constantExpression('2')
            ),
        } 
    }
    const argument = this.argument;
    const argumentDerivative = argument.derivative();
    const rules = [tanDerivativeRule, chainRule];
    const appliedRule = multiplicationExpression(
        constantPowerExponentialExpression(
            secExpression(this.argument), constantExpression('2')
        ),
        derivativeExpression(argument)
    );
    const result = multiplicationExpression(
        constantPowerExponentialExpression(
            secExpression(this.argument), constantExpression('2')
        ),
        argumentDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [argumentDerivative],
        result,
    };
};

const tanExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.basicFunctionExpression,
        toString: tanExpressionToString,
        derivative: tanExpressionDerivative,
        isConstant: unaryIsConstant,
    };
    return ret;
}

exports.tanExpression = tanExpression;

const cotExpressionToString = function() {
    return 'cot' + '(' + this.argument.toString() + ')'
};

const cotExpressionDerivative = function() {
    const cotDerivativeRule = 'd/dx cot(x) = -csc^2(x)';
    const expressionDerivative = derivativeExpression(this); 
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.argument.expressionType === expressionTypes.variableExpression) {
        return {
            expressionDerivative,
            rules: [cotDerivativeRule],
            appliedRule: null,
            childDerivatives: null,
            result: unaryMinusExpression( 
                constantPowerExponentialExpression(
                    cscExpression(this.argument), constantExpression('2')
                )
            )
        } 
    }
    const argument = this.argument;
    const argumentDerivative = argument.derivative();
    const rules = [cotDerivativeRule, chainRule];
    const appliedRule = multiplicationExpression(
        unaryMinusExpression( 
            constantPowerExponentialExpression(
                cscExpression(this.argument), constantExpression('2')
            )
        ),
        derivativeExpression(argument)
    );
    const result = multiplicationExpression(
        unaryMinusExpression( 
            constantPowerExponentialExpression(
                cosecExpression(this.argument), constantExpression('2')
            )
        ),
        argumentDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [argumentDerivative],
        result,
    };
};

const cotExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.basicFunctionExpression,
        toString: cotExpressionToString,
        derivative: cotExpressionDerivative,
        isConstant: unaryIsConstant,
    };
    return ret;
}

exports.cotExpression = cotExpression;

const secExpressionToString = function() {
    return 'sec' + '(' + this.argument.toString() + ')'
};

const secExpressionDerivative = function() {
    const secDerivativeRule = 'd/dx sec(x) = sec(x)*tan(x)';
    const expressionDerivative = derivativeExpression(this); 
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.argument.expressionType === expressionTypes.variableExpression) {
        return {
            expressionDerivative,
            rules: [secDerivativeRule],
            appliedRule: null,
            childDerivatives: null,
            result: multiplicationExpression(this, tanExpression(this.argument)),
        } 
    }
    const argument = this.argument;
    const argumentDerivative = argument.derivative();
    const rules = [secDerivativeRule, chainRule];
    const appliedRule = multiplicationExpression(
        multiplicationExpression(this, tanExpression(this.argument)),
        derivativeExpression(argument)
    );
    const result = multiplicationExpression(
        multiplicationExpression(this, tanExpression(this.argument)),
        argumentDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [argumentDerivative],
        result,
    };
};

const secExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.basicFunctionExpression,
        toString: secExpressionToString,
        derivative: secExpressionDerivative,
        isConstant: unaryIsConstant,
    };
    return ret;
}

exports.secExpression = secExpression;

const cscExpressionToString = function() {
    return 'csc' + '(' + this.argument.toString() + ')'
};

const cscExpressionDerivative = function() {
    const cscDerivativeRule = 'd/dx csc(x) = -csc(x)*cot(x)';
    const expressionDerivative = derivativeExpression(this); 
    if(this.isConstant()) {
        return constantDerivative.call(this);
    }
    if(this.argument.expressionType === expressionTypes.variableExpression) {
        return {
            expressionDerivative,
            rules: [cscDerivativeRule],
            appliedRule: null,
            childDerivatives: null,
            result: multiplicationExpression(unaryMinusExpression(this), cotExpression(this.argument)),
        } 
    }
    const argument = this.argument;
    const argumentDerivative = argument.derivative();
    const rules = [cscDerivativeRule, chainRule];
    const appliedRule = multiplicationExpression(
        multiplicationExpression(unaryMinusExpression(this), cotExpression(this.argument)),
        derivativeExpression(argument)
    );
    const result = multiplicationExpression(
        multiplicationExpression(unaryMinusExpression(this), cotExpression(this.argument)),
        argumentDerivative.result
    );
    return {
        expressionDerivative,
        rules,
        appliedRule,
        childDerivatives: [argumentDerivative],
        result,
    };
};

const cscExpression = (argument) => {
    const ret = {
        argument,
        expressionType: expressionTypes.basicFunctionExpression,
        toString: cscExpressionToString,
        derivative: cscExpressionDerivative,
        isConstant: unaryIsConstant,
    };
    return ret;
}

exports.cscExpression = cscExpression;
