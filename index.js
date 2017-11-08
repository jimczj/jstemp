

let html = '<p>how to</p>{% for num in TutorialList %}let say{{ num.num }}{% endfor %}{% if obj %}{{obj.test}}{% else %} 你是傻逼{% endif %}';


function cal_value_statement(env, valueName) {
    let result = env;
    for (let name of valueName.split('.')) {
        result  = result[name];
    }
    return result;
}

function cal_for_statement(env, listName, itemName, childNodes) {
    let result = '';
    let obj = {};
    let name = itemName.split('.')[0];
    for (let item of env[listName]) {
        obj[name] = item;
        let statementEnv = Object.assign(obj, env);
        for (let childNode of childNodes) {
            result += cal(statementEnv, childNode);
        }
    }
    return result;
}
function cal_if_statement(env, node) {
    let condition_status = cal_condition_statement(node.condition);
    let result = '';
    if (condition_status) {
        for (let childNode of node.if_body) {
            result += cal(env, childNode);
        }
        return result;
    }
    if (node.else) {
        return cal_if_statement(env, node.else);
    }
    return '';
}
// unary
// binary
let condition = {
    type: 'binary',
    operator: '==',
    left: {
        type: 'unary',
        operator: '++',
        valueName: 'a'
    },
    right: {
        type: 'int',
        value: '1'
    }

};
function cal_condition_statement(env, condition) {
    console.log(condition);
    if (!condition) {
        return false;
    }
    if (condition.type === 'binary') {
        if (condition.operator === '==') {
            return cal_condition_statement(env, condition.left) == cal_condition_statement(env, condition.right);
        }
        else if (condition.operator === '<=') {
            return cal_condition_statement(env, condition.left) <= cal_condition_statement(env, condition.right);
        }
        else if (condition.operator === '<') {
            return cal_condition_statement(env, condition.left) < cal_condition_statement(env, condition.right);
        }
        else if (condition.operator === '>=') {
            return cal_condition_statement(env, condition.left) >= cal_condition_statement(env, condition.right);
        }
        else if (condition.operator === '>') {
            return cal_condition_statement(env, condition.left) > cal_condition_statement(env, condition.right);
        }
        else if (condition.operator === '&&') {
            return cal_condition_statement(env, condition.left) && cal_condition_statement(env, condition.right);
        }
        else if (condition.operator === '||') {
            return cal_condition_statement(env, condition.left) || cal_condition_statement(env, condition.right);
        }
        else {
            throw Error("unknown");
        }

    }
    else {
        if (condition.operator === '++') {
            return env[condition.valueName]++;
        }
        else if (condition.operator === '?') {
            return env[condition.valueName] ? true : false;
        }
        else if (condition.type == 'int')  {
            return parseInt(condition.value);
        }
        else {
            throw Error("unknown");
        }
    }
}
console.log(cal_condition_statement({a: 1}, condition));

let env = {
    obj: {test: 'hello world'},
    TutorialList: [
        {num: 1},
        {num: 2},
        {num: 3}
    ]
};

function cal(env, node) {
    let result = '';
    while (node) {
        if (node.type === 'text') {
            result += node.text;
        }
        else if (node.type === 'for') {
            result += cal_for_statement(env, node.listName, node.itemName, node.childNodes);
        }
        else if (node.type === 'value') {
            result += cal_value_statement(env, node.valueName);
        }
        else if (node.type === 'if') {
            result += cal_if_statement(env, node);
        }
        else {
            console.log("unknown node type");
        }
        node  = node.next;
    }
    return result;
}

let node1 = {
    type: 'text',
    text: '<p>how to</p>'
};

let node2 = {
    type: 'for',
    itemName: 'num',
    listName: 'TutorialList',
    childNodes:[
        {
            type: 'text',
            text: 'let say'
        },
        {
            type: 'value',
            valueName: 'num.num'
        }
    ]
};

node1.next = node2;

let node3 = {
    type: 'if',
    condition: 'obj',
    if_body:[
        {
            type: 'value',
            valueName: 'obj.test'
        }
    ]
};
let node4 = {
    type: 'if',
    condition: true,
    if_body: [
    {
        type: 'text',
        text: '你是傻逼'
    }
    ]
};




node2.next = node3;
node3.else = node4;
console.log(cal(env, node1));
