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
jstemp('{{value}}', {value: 'hello world'});// hello world



// 渲染if 表达式,目前if 条件表达式不支持复杂的表达式，如>=,||,&&,后期将加强
jstemp('{% if value1 %}hello{% elseif value %}world{% else %}byebye{% endif %}', {value: 'hello world'});// world

// 渲染列表
jstemp('{%for item : list %}{{item}}{%endfor%}', {list:[1, 2, 3]});// 123
```
# License
MIT License

Copyright (c) 2017 jimczj

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



