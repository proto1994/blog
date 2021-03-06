

### 一、什么是HTTPS

HTTPS是在HTTP上建立SSL加密层，并对传输数据进行加密，是HTTP协议的安全版

HTTPS主要作用是：

- 对数据进行加密，并建立一个信息安全通道，来保证传输过程中的数据安全
- 对网站服务器进行真是身份认证

### 二、为什么需要HTTPS

HTTP协议存在的问题：

- 通信使用明文，内容可能被窃听
- 无法证明报文的完成性，可能遭篡改
- 不验证通信方的身份，因此有可能遭遇伪装

HTTPS协议有以下优势：

- 数据隐私性：内容经过对称加密，每个连接生成一个唯一的加密密钥
- 数据完整性：内容传输经过完整性校验
- 身份认证：第三方无法伪造服务端（客户端）身份

### 三、HTTPS如何解决HTTP上述问题

HTTPS并非是应用层的一种新协议。只是HTTP的通信接口部分用SSL和TLS协议代替而已

通常，HTTP直接和TCP通信。当使用SSL时，则演变成先和SSL通信，再由SSL和TCP通信。简言之，**所谓HTTPS，其实就是身披SSL协议这层外壳的HTTP**

![img](https://camo.githubusercontent.com/ad80d63610269f5789c00eea3814da2321b61723079354669b741fe2df6effaa/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31322f32322f313637643438323335666135666232323f773d35343326683d32343826663d706e6726733d3431353433)

在采用SSL后，HTTP就拥有了HTTPS的加密，证书和完整性保护这些功能。也就是说HTTP加上加密处理和认证以及完整性保护后即是HTTPS

![img](https://camo.githubusercontent.com/83dceff36b705b1811385aba8a45da29a2fab3d3cd85309e5da5b7370b798422/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31322f32322f313637643438363063306564653033333f773d35333926683d33303026663d706e6726733d3238373238)

HTTPS协议的主要功能基本都依赖于TLS/SSL协议，TLS/SSL的功能实验主要依赖于三类基本算法：

- 散列函数
- 对称加密
- 非对称加密

**利用非对称加密实现身份认证和密钥协商，对称加密算法采用协商的密钥对数据加密，基于散列函数验证信息的完整性**

![img](https://camo.githubusercontent.com/a61e78b66b7c8aa07399e7b26c62e3b2cb607d3a921a1e1312ee8561a63fd38a/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31322f32322f313637643438626337376565363966383f773d35363126683d32393726663d706e6726733d313430313839)

##### 1.解决内容可能被窃听的问题—加密

- 对称加密

  这种方法加密和解密同用一个密钥。加密和解密都会用到密钥。没有密钥就无法对密码解密，反过来说，任何人只要持有密钥就能解密了。**并且以对称加密方式加密时密钥也要发送给对方**

- 非对称加密

  公开密钥加密使用一对非对称的密钥。一把叫做私有密钥，另一把叫做公开密钥。私有密钥不能让其他任何人知道，而公开密钥则可以随便发布，任何人都可以获得

  使用公开密钥加密方式，发送密文的一方使用对方的公开密钥进行加密处理，对方收到被加密的信息后，再使用自己的私有密钥进行解密。利用这种方式，不需要发送用来解密的私有密钥，也不必担心密钥被攻击者窃听而盗走

  非对称加密的特点是信息传输一对多，服务器只需要维持一个私钥就能够和多个客户端进行加密通信

  这种方式有以下缺点： 	

  - 公钥是公开的，所以针对私钥加密的信息，黑客截获后可以使用公钥进行解密，获取其中的内容
  - 公钥并不包含服务器的信息，使用非对称加密算法无法确保服务器身份的合法性，存在中间人攻击的风险，服务器发送给客户端的公钥可能在传送过程中被中间人截获并篡改
  - 时间消耗较多，降低数据的传输效率

- 对称加密+非对称加密（HTTPS采用这种方式）

  使用对称密钥的好处是解密效果比较快，使用非对称密钥的好处是可以使传输的内容不能被破解，因为就算你拦截到了数据，但是没有对应的私钥，也是不能破解内容的。结合对称加密和非对称加密的优势，**在交换密钥环节使用非对称加密方式，之后的建立通信交换报文阶段则使用对称加密方式**

  具体做法是：**发送密文的一方使用对方的公钥进行加密处理“对称的密钥”，然后对方用自己的私钥解密拿到“对称的密钥”，这样可以确保交换的密钥是安全的前提下，使用对称加密方式进行通信。**

##### 2.解决报文可能遭篡改问题—数字签名

- 能确定消息确实是由发送方签名并发出来的，因为别人假冒不了发送方的签名
- 数字签名能确定消息的完整性，证明数据是否未被篡改过

##### 3.解决通信方身份可能被伪装的问题—数字证书



### 四、HTTPS工作流程

1. Client发起一个HTTPS请求，根据规定，Client知道需要连接Server的443端口
2. Server把事先配置好的公钥证书返回给客户端
3. Client验证公钥证书
4. Client使用伪随机数生成器生成加密所使用的对称密钥，然后用证书的公钥加密这个对称密钥，发给Server
5. Server使用自己的私钥解密这个信息，得到对称密钥。至此，Client和Server双方都持有了相同的对称密钥
6. Server使用对称密钥加密"明文内容A",发送给Client
7. Client使用对称密钥解密响应的密文，得到“明文内容A”
8. Client再次发起HTTPS的请求，使用对称密钥加密请求的“明文内容B”，然后Server使用对称密钥解密密文，得到“明文内容B”

### 五、HTTP与HTTPS的区别

1. HTTP是明文传输协议，HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比HTTP安全
2. HTTPS比HTTP更加安全，多搜索引擎更友好，利于SEO。谷歌百度优先索引HTTPS网页
3. HTTPS需要用到SSL证书，HTTP不用
4. HTTPS标准端口443，HTTP标准端口80
5. HTTPS基于传输层，HTTP基于应用层
6. HTTPS在浏览器中会有安全锁显示，HTTP不会



