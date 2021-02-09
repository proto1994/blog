### 区别：

> call和apply改变了函数this的上下文并执行了该函数，bind则是返回改变了上下文的一个函数
>
> apply的参数是数组，call是参数列表



### 实现call

```js
Function.prototype.myCall = function(context=window, args) {
  if (this === Function.prototype) {
    return undefined;
  }
  
  let fn = Symbol();
  context[fn] = this;
	const result = context[fn](...args);
  delete context[fn];
  return result;
}

function add(a, b) {
  return a + b
}

add.myCall(null, 3, 4)
```



### 实现apply

跟call方式一致

```js
Function.prototype.myApply = function(context = window, args) {
  if (this === Function.prototype) {
    return undefined;
  }
  let fn = Symbol();
  context[fn] = this;
	const result = context[fn](...args);
  delete context[fn];
  return result;
}
```



#### 实现bind

```js
Function.prototype.myBind = function(context = window, ...args1) {
	 if (this === Function.prototype) {
    throw new TypeError('error')
  }
  const _this = this;
  return function F(...args2) {
    if (this instanceof F) {
      return new _this(...args1, ...args2);
    }
    return _this.apply(context, args1.concat(args2))
  }
}


```



参考： http://www.conardli.top/docs/JavaScript/%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0call%E3%80%81apply%E3%80%81bind.html#%E6%A8%A1%E6%8B%9F%E5%AE%9E%E7%8E%B0apply