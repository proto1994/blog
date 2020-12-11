```js
let i = 1;
while(i--) {
  console.log(i)
}
```

i-- 是先赋值，后运算，所以上面输出0

```js
let i = 1;
while(--i) {
 console.log(i)
}		
```

--i 是运算，后赋值，所以上面直接跳出循环了

![image-20201202201001431](/Users/proto/Library/Application Support/typora-user-images/image-20201202201001431.png)

顺带看下参数赋值的问题，参数赋值只有undefined的时候才会生效。。

