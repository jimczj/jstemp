/**
 * @file tokenType
 * @author jimczj
 * @created 2017-11-09
 */
module.exports = {
    EOF: 0,
    Character: 1, // 字符串
    Variable: 2, // 变量
    VariableName: 3, // 变量名
    IfStatement: 4,
    IfCondition: 5,
    ElseIfStatement: 6,
    ElseStatement: 7,
    EndTag: 8,
    EndIfStatement: 9,
    ForStatement: 10,
    ForItemName: 11,
    ForListName: 12,
    EndForStatement: 13
};
