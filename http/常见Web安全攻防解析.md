## 一、XSS

跨脚本攻击，指通过存在安全漏洞的Web网站注册用户的浏览器内运行非法的HTML标签或者Javascript进行的一种攻击

**XSS原理是恶意攻击者往Web网页中插入恶意可执行的网页脚本代码，当用户浏览该网页时，脚本代码会被执行，从而可以达到攻击者盗取用户信息或者其他侵犯用户隐私的目的**

##### 如何预防：

1. csp

   csp本质就是建立白名单，明确告诉浏览器哪些资源可以加载和执行，可以通过下面两种方式开启

   - 设置HTTP header中的Content-Security-Policy
   - 设置Meta标签

   ```
   // 只允许加载本站资源
   Content-Security-Policy: default-src 'self'
   // 只允许加载 HTTPS 协议图片
   Content-Security-Policy: img-src https://*
   // 允许加载任何来源框架
   Content-Security-Policy: child-src 'none'
   
   ```

2. 转义字符

3. HttpOnly Cookie设置

   这是预防XSS攻击窃取用户最有效的方式，将cookie属性设置为HttpOnly，就可以避免该网页的cookie信息被客户端恶意javaScript窃取

## 二、CSRF

跨站请求伪造，利用用户已登录的身份，在用户豪不知情的情况下，以用户的名义完成非法操作

1. 原理

   ![img](https://camo.githubusercontent.com/8a5fa049dae3b46b27be948428ea77aef5d0d6f89bc0011f12a6fd081170fdc9/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031392f312f32342f313638383033306132343730323330313f773d34333226683d33303326663d706e6726733d3434343837)

2. 防御

   可遵循以下规则：

   - Get请求时候不对数据进行修改
   - 不让第三方用户访问到用户的cookie
   - 阻止第三方网站请求接口
   - 请求时附带验证信息，比如验证码或者token

   1. #### sameSite

      可以对cookie设置SameSite属性，表示cookie不随着跨域请求发送。但浏览器兼容不好

   2. Referer Check

      可以做监控，因为HTTPS跳转到HTTP的时候，浏览器不会发送referer

   3. Anti CSRF Token

      发送HTTP请求时携带token，并在服务端建立拦截来验证token。

   4. 验证码

## 三、SQL注入

防御：

1. 严格限制Web应用的数据库的操作权限
2. 后端代码检查输入的数据格式是否符合预期
3. 对进入的数据库的特殊字符进行转义，或者编码转换
4. 所有的查询语句建议使用数据库提供的参数化查询接口