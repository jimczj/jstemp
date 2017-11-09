const assert = require('assert');
const render = require('../index');

let env = {
    obj: {value: 'world'},
    list: [
        {num: 1},
        {num: 2},
        {num: 3}
    ]
};

describe('render(template, env)', () => {
    it('should render variable', () => {
        assert.equal('<p>hello world', render('<p>hello {{ obj.value }}', env));
    });
});

