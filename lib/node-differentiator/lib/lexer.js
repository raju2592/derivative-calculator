const lex = require('lex');
const lexerRules = require('./lexerRules');

module.exports = (() => {
    const lexer = new lex((char) => {
        throw Error('unrecognized character');
    });
    const addRules = (rules) => {
        for(let i = 0; i < rules.length; i++) {
            lexer.addRule(rules[i].rule, (lexeme) => {
                return { lexeme, tokenName: rules[i].tokenName }
            });
        }
    }
    addRules(lexerRules);
    const getLexemes = (input) => {
        lexer.setInput(input);
        const lexemes = [];
        let lexSuccess = true;
        while(1) {
            try{
                const lexeme = lexer.lex();
                if(!lexeme) break;
                lexemes.push(lexeme);
            } catch(err) {
                lexSuccess = false;
                break;
            }
        } 
        if(lexSuccess) return lexemes;
        return null;
    }
    return {
        getLexemes,
    }
})();
