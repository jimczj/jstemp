const assert = require('assert');
const render = require('../index').render;

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
        assert.equal('<p>hello world</p>', render('<p>hello {{ obj.value }}</p>', env));
    });
    it('should render list', () => {
        assert.equal('<p>hello 1</p><p>hello 2</p><p>hello 3</p>', render('{%for obj : list %}<p>hello {{ obj.num }}</p>{% endfor%}', env));
    });
    it('should render if statement block', () => {
        assert.equal('if', render('{%if obj%}if{% elseif list %}elseif{% else %}else{% endif %}', env));
    });
    it('should render elseif statement block', () => {
        assert.equal('elseif', render('{%if obj1%}if{% elseif list %}elseif{% else %}else{% endif %}', env));
    });
    it('should render else statement block', () => {
        assert.equal('else', render('{%if obj1%}if{% elseif list2 %}elseif{% else %}else{% endif %}', env));
    });

    it('should render list and if statement block', () => {
        assert.equal('123', render('{%for obj : list %}{% if obj.num %}{{ obj.num }}{% else %}else{% endif %}{% endfor%}', env));
    });
    it('should render list and else statement block', () => {
        assert.equal('222', render('{%for obj : list %}{% if obj.num2 %}{{ obj.num2 }}{% else %}2{% endif %}{% endfor%}', env));
    });
});
