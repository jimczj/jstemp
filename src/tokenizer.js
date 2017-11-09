/**
 * @file tokenizer
 * @author jimczj
 * @created 2017-11-07
 */

const TokenType = require('./tokenType');

class Tokenizer {

    constructor(template) {
        this.state = Tokenizer.InitState;
        this.template = template;
        this.baseoffset = 0;
    }

    _getNextStr(offset) {
        if (this.baseoffset + offset <= this.template.length) {
            return this.template.substring(this.baseoffset, this.baseoffset + offset);
        }
        return '';
    }

    nextToken() {
        Tokenizer.currentToken = '';
        while (this.baseoffset <= this.template.length) {
            switch (this.state) {
                case Tokenizer.InitState:
                    if (this.template[this.baseoffset] === '{') {
                        this.state = Tokenizer.LeftBraceState;
                        this.baseoffset++;
                    }
                    else if (this.template[this.baseoffset] === '\\') {
                        this.state = Tokenizer.EscapeState;
                        this.baseoffset++;
                    }
                    else {
                        this.state = Tokenizer.CharState;
                        Tokenizer.currentToken += this.template[this.baseoffset++];
                    }
                    break;
                case Tokenizer.CharState:
                    if (this.template[this.baseoffset] === '{') {
                        this.state = Tokenizer.LeftBraceState;
                        this.baseoffset++;
                        return TokenType.Character;
                    }
                    else if (this.template[this.baseoffset] === '\\') {
                        this.state = Tokenizer.EscapeState;
                        this.baseoffset++;
                    }
                    else {
                        Tokenizer.currentToken += this.template[this.baseoffset++];
                    }
                    break;
                case Tokenizer.EscapeState:
                    this.state = Tokenizer.Character;
                    Tokenizer.currentToken += this.template[this.baseoffset++];
                    break;
                case Tokenizer.LeftBraceState:
                    if (this.template[this.baseoffset] === '{') {
                        this.baseoffset++;
                        this.state = Tokenizer.BeforeVariableState;
                        return TokenType.Variable;
                    }
                    else if (this.template[this.baseoffset] === '%') {
                        this.baseoffset++;
                        this.state = Tokenizer.BeforeStatementState;
                    }
                    else {
                        this.state = Tokenizer.CharState;
                        Tokenizer.currentToken += '{' + this.template[this.baseoffset++];
                    }
                    break;
                case Tokenizer.BeforeStatementState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                    }
                    else if (('a' <= this.template[this.baseoffset] && this.template[this.baseoffset] <= 'z')
                        || ('A' <= this.template[this.baseoffset] && this.template[this.baseoffset] <= 'Z')) {
                        this.state = Tokenizer.StatementState;
                    }
                    else {
                        console.log(this.state, this.template[this.baseoffset]);
                        throw Error('变量名不合法');
                    }
                    break;
                case Tokenizer.StatementState:
                    if (this._getNextStr(2) === 'if') {
                        this.state = Tokenizer.BeforeIfConditionState;
                        this.baseoffset += 2;
                        return TokenType.IfStatement;
                    }
                    else if (this._getNextStr(6) === 'elseif') {
                        this.state = Tokenizer.BeforeIfConditionState;
                        this.baseoffset += 6;
                        return TokenType.ElseIfStatement;
                    }
                    else if (this._getNextStr(4) === 'else') {
                        this.state = Tokenizer.BeforeEndStatementState;
                        this.baseoffset += 4;
                        return TokenType.ElseStatement;
                    }
                    else if (this._getNextStr(5) === 'endif') {
                        this.baseoffset += 5;
                        this.state = Tokenizer.BeforeEndStatementState;
                        return TokenType.EndIfStatement;
                    }
                    else if (this._getNextStr(3) === 'for') {
                        this.baseoffset += 3;
                        this.state = Tokenizer.BeforeForItemNameState;
                        return TokenType.ForStatement;
                    }
                    else if (this._getNextStr(6) === 'endfor') {
                        this.baseoffset += 6;
                        this.state = Tokenizer.BeforeEndStatementState;
                        return TokenType.EndForStatement;
                    }
                    else {
                        throw Error('未知表达式');
                    }
                    break;
                case Tokenizer.BeforeIfConditionState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                    }
                    else {
                        this.state = Tokenizer.IfConditionState;
                    }
                    break;
                case Tokenizer.IfConditionState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.state = Tokenizer.BeforeEndStatementState;
                        this.baseoffset++;
                        return TokenType.IfCondition;
                    }
                    else if (this.template[this.baseoffset] === '%') {
                        this.baseoffset++;
                        this.state = Tokenizer.PercentState;
                        return TokenType.IfCondition;
                    }
                    else {
                        Tokenizer.currentToken += this.template[this.baseoffset++];
                    }
                    break;
                case Tokenizer.BeforeEndStatementState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                    }
                    else if (this.template[this.baseoffset] === '%') {
                        this.state = Tokenizer.PercentState;
                        this.baseoffset++;
                    }
                    else {
                        throw Error('错误的语法');
                    }
                    break;
                case Tokenizer.PercentState:
                    if (this.template[this.baseoffset] === '}') {
                        this.baseoffset++;
                        this.state = Tokenizer.InitState;
                        return TokenType.EndTag;
                    }
                    throw Error('错误的语法');
                    break;
                case Tokenizer.BeforeForItemNameState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                    }
                    else {
                        this.state = Tokenizer.ForItemNameState;
                    }
                    break;
                case Tokenizer.ForItemNameState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                        this.state = Tokenizer.BeforeColonState;
                        return TokenType.ForItemName;
                    }
                    else {
                        Tokenizer.currentToken += this.template[this.baseoffset++];
                    }
                    break;
                case Tokenizer.BeforeColonState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                    }
                    else if (this.template[this.baseoffset] === ':') {
                        this.baseoffset++;
                        this.state = Tokenizer.BeforeForListNameState;
                    }
                    else {
                        throw Error('错误的语法');
                    }
                    break;
                case Tokenizer.BeforeForListNameState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                    }
                    else if (('a' <= this.template[this.baseoffset] && this.template[this.baseoffset] <= 'z')
                        || ('A' <= this.template[this.baseoffset] && this.template[this.baseoffset] <= 'Z')) {
                        this.state = Tokenizer.ForListNameState;
                    }
                    else {
                        throw Error('错误的语法');
                    }
                    break;
                case Tokenizer.ForListNameState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                        this.state = Tokenizer.BeforeEndStatementState;
                        return TokenType.ForListName;
                    }
                    else if (('a' <= this.template[this.baseoffset] && this.template[this.baseoffset] <= 'z')
                        || ('A' <= this.template[this.baseoffset] && this.template[this.baseoffset] <= 'Z')) {
                        Tokenizer.currentToken += this.template[this.baseoffset++];
                    }
                    else {
                        throw Error('错误的语法');
                    }
                    break;
                case Tokenizer.BeforeVariableState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                    }
                    else {
                        this.state = Tokenizer.VariableState;
                    }
                    break;
                case Tokenizer.VariableState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                        this.state = Tokenizer.BeforeEndVariableState;
                        return TokenType.VariableName;
                    } else if (this.template[this.baseoffset] === '}') {
                        this.baseoffset++;
                        this.state = Tokenizer.RightBraceState;
                        return TokenType.VariableName;
                    }
                    else {
                        Tokenizer.currentToken += this.template[this.baseoffset++];
                    }
                    break;
                case Tokenizer.BeforeEndVariableState:
                    if (this.template[this.baseoffset] === ' '
                        || this.template[this.baseoffset] === '\t'
                        || this.template[this.baseoffset] === '\n') {
                        this.baseoffset++;
                    }
                    else if (this.template[this.baseoffset] === '}') {
                        this.state = Tokenizer.RightBraceState;
                        this.baseoffset++;
                    }
                    else {
                        throw Error('标签没有闭合');
                    }
                    break;
                case Tokenizer.RightBraceState:
                    if (this.template[this.baseoffset] === '}') {
                        this.baseoffset++;
                        this.state = Tokenizer.InitState;
                        return TokenType.EndTag;
                    }
                    else {
                        throw Error('标签没有闭合');
                    }
                    break;
                default:
                    console.log(this.state, this.template[this.baseoffset]);
                    throw Error('错误的语法');
            }

        }
        return TokenType.EOF;
    }
}

Tokenizer.currentToken = '';

Tokenizer.InitState = 0; // 初始
Tokenizer.LeftBraceState = 1; // {
Tokenizer.RightBraceState = 2; // }
Tokenizer.BeforeStatementState = 3;
Tokenizer.StatementState = 4;
Tokenizer.BeforeIfConditionState = 5;
Tokenizer.IfConditionState = 6;
Tokenizer.BeforeForItemNameState = 7;
Tokenizer.ForItemNameState = 8;
Tokenizer.BeforeColonState = 9;
Tokenizer.BeforeForListNameState = 10;
Tokenizer.ForListNameState = 11;
Tokenizer.BeforeEndStatementState = 12;
Tokenizer.PercentState = 13; // %
Tokenizer.EscapeState = 14; // 转义
Tokenizer.CharState = 15; // 字符串
Tokenizer.BeforeVariableState = 16; // 变量
Tokenizer.BeforeEndVariableState = 17;
Tokenizer.VariableState = 18;

module.exports = Tokenizer;


