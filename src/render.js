/**
 * @file render
 * @author jimczj
 * @created 2017-11-09
 */
const Parser = require('./parser');
const TokenType = require('./tokenType');

function render(template, env) {
    let parser = new Parser(template);
    let rootNode = parser.parse();
    let html = '';
    let node;
    for (node of rootNode.childNodes) {
        html += calStatement(env, node);
    }
    return html;
}

function calStatement(env, node) {
    let html = '';
    switch (node.type) {
        case TokenType.Character:
            html += node.value;
            break;
        case TokenType.Variable:
            html += calVariable(env, node.valueName);
            break;
        case TokenType.IfStatement:
            html += calIfStatement(env, node);
            break;
        case TokenType.ForStatement:
            html += calForStatement(env, node);
            break;
        default:
            throw Error('未知node type');
    }
    return html;
}

function calVariable(env, valueName) {
    if (!valueName) {
        return '';
    }
    let result = env;
    for (let name of valueName.split('.')) {
        result  = result[name];
    }
    return result;
}

function calForStatement(env, node) {
    let result = '';
    let obj = {};
    let name = node.itemName.split('.')[0];
    for (let item of env[node.listName]) {
        obj[name] = item;
        let statementEnv = Object.assign(env, obj);
        for (let childNode of node.childNodes) {
            result += calStatement(statementEnv, childNode);
        }
    }
    return result;
}

function calConditionStatement(env, condition) {
    if (typeof condition === 'string') {
        return calVariable(env, condition) ? true : false;
    }
    return condition ? true : false;
}

function calIfStatement(env, node) {
    let status = calConditionStatement(env, node.condition);
    let result = '';
    if (status) {
        for (let childNode of node.childNodes) {
            result += calStatement(env, childNode);
        }
        return result;
    }

    for (let elseifNode of node.elseifNodes) {
        let elseIfStatus = calConditionStatement(env, elseifNode.condition);
        if (elseIfStatus) {
            for (let childNode of elseifNode.childNodes) {
                result += calStatement(env, childNode);
            }
            return result;
        }
    }
    return result;
}

module.exports = {render};
