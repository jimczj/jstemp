
const TokenType = {
    EOF: 'EOF',
    Character: 'Character', // 字符串
    Variable: 'Variable', // 变量
    ExpresionStatement: 'ExpresionStatement',
    IfStatement: 'IfStatement',
    IfCondition: 'IfCondition',
    ElseIfStatement: 'ElseIfStatement',
    ElseStatement: 'ElseStatement',
    EndTag: 'EndTag',
    EndIfStatement: 'EndIfStatement',
    ForStatement: 'ForStatement',
    ForItemName: 'ForItemName',
    ForListName: 'ForListName',
    EndForStatement: 'EndForStatement'
};
let template = '<p>how to</p>{%for num : list %}let say{{num.num}}{%endfor%}{%if obj%}{{obj.test}}{%else%} 你是傻逼{%endif%}';

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
                        return TokenType.Variable;
                    } else if (this.template[this.baseoffset] === '}') {
                        this.baseoffset++;
                        this.state = Tokenizer.RightBraceState;
                        return TokenType.Variable;
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

Tokenizer.InitState = 'InitState'; // 初始
Tokenizer.LeftBraceState = 'LeftBraceState'; // {
Tokenizer.RightBraceState = 'RightBraceState'; // }
Tokenizer.BeforeStatementState = 'BeforeStatementState';
Tokenizer.StatementState = 'StatementState';
Tokenizer.BeforeIfConditionState = 'BeforeIfConditionState';
Tokenizer.IfConditionState = 'IfConditionState';
Tokenizer.BeforeForItemNameState = 'BeforeForItemNameState';
Tokenizer.ForItemNameState = 'ForItemNameState';
Tokenizer.BeforeColonState = 'BeforeColonState';
Tokenizer.BeforeForListNameState = 'BeforeForListNameState';
Tokenizer.ForListNameState = 'ForListNameState';
Tokenizer.BeforeEndStatementState = 'BeforeEndStatementState';
Tokenizer.PercentState = 'PercentState'; // %
Tokenizer.EscapeState = 'EscapeState'; // 转义
Tokenizer.CharState = 'CharState'; // 字符串
Tokenizer.BeforeVariableState = 'BeforeVariableState'; // 变量
Tokenizer.BeforeEndVariableState = 'BeforeEndVariableState';
Tokenizer.VariableState = 'VariableState';
let token = new Tokenizer(template);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
console.log(token.nextToken());
console.log(Tokenizer.currentToken);
