# jstemp
一个javascript模板引擎，词法分析没有使用正则表达式和其他第三方库，纯手写有穷状态机。目前支持变量替换,if\elseif\else表达式，for语句。暂不支持模板继承，过滤器等功能，错误处理也比较暴力，后期将继续完善。此库目前仅供练习使用，本人会将开发本库的过程写成博客记录下来，如果对这方面有兴趣，可以点star或watch。

# 安装

```
npm install jstemp --save
```
# 使用方法

```
var jstemp = require('jstemp');
// 渲染变量
jstemp.render('{{value}}', {value: 'hello world'});// hello world



// 渲染if 表达式,目前if 条件表达式不支持复杂的表达式，如>=,||,&&,后期将加强
jstemp.render('{% if value1 %}hello{% elseif value %}world{% else %}byebye{% endif %}', {value: 'hello world'});// world

// 渲染列表
jstemp.render('{%for item : list %}{{item}}{%endfor%}', {list:[1, 2, 3]});// 123
```
# License
MIT License

Copyright (c) 2017 jimczj



