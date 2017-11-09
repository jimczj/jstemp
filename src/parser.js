/**
 * @file parser
 * @author jimczj
 * @created 2017-11-08
 */

const Tokenizer = require('./tokenizer');
const NodeType = require('./nodeType');
const TokenType = require('./tokenType');

class Parser {

    constructor(template) {
        this.tokenizer = new Tokenizer(template);
        this.rootNode = {
            childNodes: []
        };
    }

    parse(node) {
        node = node || this.rootNode;
        while (true) {
            switch (this.tokenizer.nextToken()) {
                case TokenType.Character:
                    node.childNodes.push({
                        type: NodeType.Character,
                        value: Tokenizer.currentToken
                    });
                    break;
                case TokenType.Variable:
                    node.childNodes.push(this.parseVariable());
                    break;
                case TokenType.IfStatement:
                    node.childNodes.push(this.parseIfStatement());
                    break;
                case TokenType.ElseIfStatement:
                    return TokenType.ElseIfStatement;
                case TokenType.ElseStatement:
                    return TokenType.ElseStatement;
                case TokenType.EndIfStatement:
                    return TokenType.EndIfStatement;
                case TokenType.ForStatement:
                    node.childNodes.push(this.parseForStatement());
                    break;
                case TokenType.EndForStatement:
                    return TokenType.EndForStatement;
                case TokenType.EOF:
                    return this.rootNode;
                default:
                    throw Error('解析错误');
            }
        }
    }

    parseVariable() {
        if (this.tokenizer.nextToken() !== TokenType.VariableName) {
            throw Error('未输入变量名');
        }
        const node = {
            type: NodeType.Variable,
            valueName: Tokenizer.currentToken
        };
        if (this.tokenizer.nextToken() !== TokenType.EndTag) {
            throw Error('变量标签未闭合');
        }
        return node;
    }

    parseIfStatement() {
        if (this.tokenizer.nextToken() !== TokenType.IfCondition) {
            throw Error('未输入if 条件');
        }
        const node = {
            type: NodeType.IfStatement,
            condition: Tokenizer.currentToken,
            elseifNodes: [],
            childNodes: []
        };
        if (this.tokenizer.nextToken() !== TokenType.EndTag) {
            throw Error('if标签未闭合');
        }
        let token = this.parse(node);
        while (token !== TokenType.EndIfStatement) {
            if (token === TokenType.ElseIfStatement) {
                let elseIfNode = this.parseElseifStatement();
                token = this.parse(elseIfNode);
                node.elseifNodes.push(elseIfNode);
            }
            else if (token === TokenType.ElseStatement) {
                let elseNode = this.parseElseifStatement(true);
                token = this.parse(elseNode);
                node.elseifNodes.push(elseNode);
            }
            else {
                throw Error('语法错误');
            }
        }
        if (this.tokenizer.nextToken() !== TokenType.EndTag) {
            throw Error('endif 标签没有闭合');
        }
        return node;
    }

    parseElseifStatement(condition) {
        if (!condition && this.tokenizer.nextToken() !== TokenType.IfCondition) {
            throw Error('未输入if 条件');
        }
        const node = {
            type: NodeType.ElseIfStatement,
            condition: condition || Tokenizer.currentToken,
            childNodes: []
        };
        if (this.tokenizer.nextToken() !== TokenType.EndTag) {
            throw Error('elseif标签未闭合');
        }

        return node;
    }

    parseForStatement() {
        if (this.tokenizer.nextToken() !== TokenType.ForItemName) {
            throw Error('for 表达式有误');
        }
        const node = {
            type: NodeType.ForStatement,
            itemName: Tokenizer.currentToken,
            listName: '',
            childNodes: []
        };
        if (this.tokenizer.nextToken() !== TokenType.ForListName) {
            throw Error('for 表达式有误');
        }
        node.listName = Tokenizer.currentToken;
        if (this.tokenizer.nextToken() !== TokenType.EndTag) {
            throw Error('for 标签没闭合');
        }
        let token = this.parse(node);
        if (token !== TokenType.EndForStatement) {
            throw Error('没有添加endfor 标签');
        }
        if (this.tokenizer.nextToken() !== TokenType.EndTag) {
            throw Error('endfor 标签没有闭合');
        }
        return node;
    }
}

module.exports = Parser;
