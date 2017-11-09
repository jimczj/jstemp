/**
 * @file render
 * @author jimczj
 * @created 2017-11-09
 */

const render = require('../index');

let env = {
    obj: {test: 'jimczj'},
    list: [
        {num: 1},
        {num: 2},
        {num: 3}
    ]
};

let template = `
<p>how to</p>
{%for num : list %}
    let say{{num.num}}
{%endfor%}
{%if obj%}
    {{obj.test}}
    {%for num : list %}
        {% if num.num %}
            {{num.num}}
        {% endif %}
    {%endfor%}
{%else%}
    你是傻逼
{%endif%}
`;

console.log(render(template, env));
