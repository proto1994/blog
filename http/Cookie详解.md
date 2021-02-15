| Set-Cookie | 开始状态管理所使用的Cookie信息 | 响应首部字段 |
| ---------- | ------------------------------ | ------------ |
| Cookie     | 服务器接收到的Cookie信息       | 请求首部字段 |

## Set-Cookie

```http
Set-Cookie: name=test; expires=Tue, 05 GMT; path=/; domain=.hackjp
```

| name=VALUE   | 赋予Cookie的名称和其值                     |
| ------------ | ------------------------------------------ |
| expires=DATE | Cookie有效期，不指定则为浏览器关闭为止     |
| path=PATH    | 将服务器上的文件目录作为Cookie的适用对象   |
| domain=域名  | 作为Cookie适用对象的域名                   |
| Secure       | 仅在HTTPS安全通信时才发送cookie            |
| HttpOnly     | 加已限制，使Cookie不能被JavaScript脚本访问 |

