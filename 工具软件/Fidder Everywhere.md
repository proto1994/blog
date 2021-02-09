- 配置https代理， 设置-> https-> Trust root certificate

- 测试环境资源代理到本地：

  Auto Responder 

  例如：

  Match: regex:https://webresource.c-ctrip.com/ResFltIntlOnline/.*/assets/(.*)

  Action: http://localhost:8005/assets/$1

