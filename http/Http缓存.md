## 一、为什么要缓存

1. 缓存可以减少用户等待时间
2. 减少网络带宽消耗
3. 降低服务器压力

## 二、缓存读写循序

当浏览器对一个资源，比如外链a.js进行请求的时候，会发生什么？

![img](https://camo.githubusercontent.com/a39136f3072c2616605c2a2ce3af7587bc930aecc75c1d862b938c31d91f0d7c/68747470733a2f2f627562757a6f752e6f73732d636e2d7368656e7a68656e2e616c6979756e63732e636f6d2f626c6f672f3230323031312f62726f777365725f3031322e706e67)

1. 调用Service Worker的fetch事件获取资源
2. 查看memory cache 
3. 查看disk cache，这里又细分
   - 如果有强缓存且未失效，则使用强缓存，不请求服务器。这时的状态码全部是200
   - 如果有强缓存但失效，则使用协商缓存，比较后确定是304还是200
4. 发送网络请求，等待网络响应
5. 把响应内容存入disk cache(如果响应头信息配置可以存的话)
6. 把响应内容的引用存入memory cache(无视请求头配置，除了no-store除外)
7. 把响应内容存入Service Worker的Cache Storage（如果Server Worker的脚本调用了cache.put）

## 三、缓存位置 

![img](https://camo.githubusercontent.com/02174a0afbdeab68cb4396b41fc9237b6b9b9ffe9a1a773f362517c79b83406b/68747470733a2f2f627562757a6f752e6f73732d636e2d7368656e7a68656e2e616c6979756e63732e636f6d2f626c6f672f3230323031312f62726f777365725f3031332e706e67)

#### Server Worker

是一个注册在指定源和路径下的事件驱动worker；特点是

- 运行在worker上下文，因此不能访问DOM
- 独立主线程之外，不会造成阻塞
- 设计完全异步，所以同步API不能在Server Worker使用
- 最后处于安全考虑，必须在HTTPS环境下才能使用

它有一个功能就是离线缓存：Server Worker Cache; 区别于memory cache 和disk cache,它允许我们自己去操控缓存；通过Server Cache设置的缓存会出现在浏览器开发者工具Application 面板下的Cache Storage中。

#### memory cache

是浏览器内存中的缓存，相比于disk cache 它的特点是读取速度快，但容量小，且时效性短，一旦浏览器tab关闭，memory cache就将清空。当Cache-Control: no-store的时候就无法把资源存入内存了，也无法存入硬盘。当从memory cache中查找缓存的时候，不仅仅会去匹配资源的URL，还会看Content-Type是否相同

#### disk cache

也叫HTTP cache是存在硬盘中的内存，根据HTTP头部的各类字段进行判定资源的缓存规则。相比memory cache具有存储空间时间长等优点



## 四、缓存策略

![img](https://camo.githubusercontent.com/a9d066a0e986569a3bdb9dae85ed7a32ed2694f60e6b39396ee8e732b66f2117/68747470733a2f2f627562757a6f752e6f73732d636e2d7368656e7a68656e2e616c6979756e63732e636f6d2f626c6f672f3230323031312f62726f777365725f3031342e706e67)

根据HTTP Header 的字段又可以将缓存分为强缓存和协商缓存。强缓存可以直接从缓存中读取资源而不需要从服务器发送请求。而协商缓存是当强缓存失效后，浏览器需要携带缓存标识向服务器发送请求，服务器根据缓存标识决定是否使用缓存的过程。

#### Expires 

Expires是HTTP/1.0的字段，表示缓存过期时间，它是一个GMT格式的时间字符串。Expires需要在服务端配置，

浏览器会根据该过期时间跟客户端时间对比，如果过期时间没到，则会去缓存中读取该资源，如果已经到期了，则浏览器判断该资源不新鲜要重新从服务端获取。Expires是一个绝对时间，会局限于客户端的时间是否准确

```
Expires: Wed, 21 Oct 2020 07:28:00 GMT
```

#### Cache-Control

它是HTTP/1.1的字段，其中包含值很多：

- max-age最大缓存时间，单位是秒
- public响应可以被任何对象（客户端，代理服务器缓存）缓存
- private响应只能被客户端缓存
- no-cache 跳过强缓存，直接进入协商缓存
- no-store不缓存任何内容，设置了这个后资源也不会被缓存到内存和硬盘

Cache-Control的值是可以混合使用的：

```
Cache-Control: private, max-age=0, no-cache
```

![img](https://camo.githubusercontent.com/14992e669ca4d5685a72081dcf24ec316327088d787970788e8243a24a29ca0e/68747470733a2f2f627562757a6f752e6f73732d636e2d7368656e7a68656e2e616c6979756e63732e636f6d2f626c6f672f3230323031312f62726f777365725f3030332e706e67)

当Expires和Cache-Control都被设置的时候，浏览器会优先考虑后者。当强缓存失效的时候，则会进入协商缓存阶段。具体细节是：浏览器从本地查找强缓存，发现失效了，然后会拿着缓存标识请求服务器，服务器拿着这个缓存标识和对应字段进行校验资源是否被修改，如果没有被修改则此时响应状态会是304，且不会返回响应资源，而是从直接从浏览器缓存中读取

浏览器缓存标识：Last-Modified和ETag

#### Last-Modified&If-Modified-Since

浏览器在第一次访问资源的时候，服务端返回资源的同时，会在响应头中加上Last-Modified表示资源最后修改的时间，然后浏览器下次再访问该资源的时候，会在请求头上加上If-Modified-Since，值为Last-Modified。服务端判断该值与这个资源最后修改的时间对比，如果没有变化，则返回304和空的响应体，直接从缓存读取，如果该值小于服务器中资源的最后修改时间，说明文件更新，则返回200和最新的文件

缺点：

- 打开文件，即使没对文件进行修改，还是会造成Last-Modified被修改，服务端不能命中缓存导致发送相同的资源
- Last-Modified只能以秒计时，如果在不可感知的时间内修改完成文件，那么服务端会认为资源还是命中了，不会返回正确的资源

#### ETag&If-None-Match

ETag是服务端响应请求时，返回当前资源的唯一标识，只要资源有变化，ETag就会重新生成。浏览器在下一次请求的时候，会将上一次返回的Etag值放在请求头上的If-None-Match里。服务端比较If-None-Match和Etag的值判断资源是否被修改

优缺点：

- 精度上，ETag要优于Last-Modified
- 性能上比Last-Modified差，因为后者只需要记录时间，前端要在服务端通过算法计算hash值
- 服务端优先使用ETag

