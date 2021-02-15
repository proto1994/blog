new 创建的时候做了哪些事情：

1. 创建一个新对象
2. 将构造函数的作用域赋值给新对象（因此this就指向了这个新对象）
3. 执行构造函数中的代码，为这个新对象添加属性
4. 返回新对象

```js
function Parent(name) {
  this.name = name
}

var p = new Parent('proto')


function myNew() {
  var obj = {};
  var Constructor = Array.prototype.shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments);
  return typeof ret === 'object' && ret !== null ? ret : obj;
}

var p1 = myNew(Parent, 'proto')
```



