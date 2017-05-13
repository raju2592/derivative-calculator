const lex = require('lex');

module.exports = (rules) => {
    const lexer = new lex();
    const addRules = (rules) => {
        for(let i = 0; i < rules.length; i++) {
            lexer.addRule(rules[i].rule, (lexeme) => {
                return { lexeme, tokenName: rules[i].tokenName }
            });
        }
    }
    addRules(rules);
    const getLexemes = (input) => {
        lexer.setInput(input);
        const lexemes = [];
        while(1) {
            const lexeme = lexer.lex();
            if(!lexeme) break;
            lexemes.push(lexeme);
        }
        return lexemes;
    }
    return {
        addRules,
        getLexemes,
    }
};
