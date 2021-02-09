#### 定义：

​	常用于定义页面的说明，关键字，最后修改日期，和其他元数据。这些元数据将服务于浏览器，搜索引擎和其他网络服务

#### 常用语法：

```html
<meta charset="UTF-8" />
<meta http-equiv="content-Type" content="text/html;charset=utf-8"> // 老写法
```

meta 元素除了charset属性外，都是结合http-equiv属性或者name属性结合content使用

```html
<meta name="参数" content="具体参数值" >
<meta http-equiv="参数" content="具体参数值" >
```

### 常用name属性字段

| 元数据名称 name的值 | 说明                                                         |
| :------------------ | ------------------------------------------------------------ |
| application name    | 当前页面web应用系统的名称                                    |
| keywords            | 描述网站内容的关键字，以逗号隔开，用于seo搜索                |
| description         | 当前页的说明                                                 |
| author              | 作者                                                         |
| copyright           | 版权信息                                                     |
| renderer            | 为双核浏览器准备的，用户指定双核浏览器默认以何种方式渲染页面 |
| viewreport          | 它提供有关视口初始化的大小，仅供移动设备使用                 |

#### viewreport:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```



1. meta标签不设置viewreport

   不设置的情况，默认视口宽度为980

2. meta name属性设置viewreport

   - content内容为空的时候，默认视口宽度为980

   - content设置width，不设置initial-scale时，视口宽度为设置的width值

   - content不设置width，只设置initial-scale时，是可以根据inital-scale的值计算出视口的宽度

     ```
     initail-scale = 屏幕宽度 / 视口宽度
     ```

   - content同时设置width和initial-scale时，视口宽度为width的值，页面显示按照intial-scale比率进行缩放



#### renderer

```html
<meta name="renderer" content="webkit" /> //默认webkit内核 
<meta name="renderer" content="ie-comp" /> //默认IE兼容模式 
<meta name="renderer" content="ie-stand" /> //默认IE标准模式
<meta name="renderer" content="webkit|ie-comp|ie-stand" />
```



### 模拟http标头字段

http-equiv属性与content属性结合使用，http-equiv属性为指定所要模拟的标头字段的名称，content属性用来提供值

```html
<meta http-equiv="参数" content="具体的描述">
```



例如：

```html
<meta http-equiv="refresh" content="2;URL=http://www.baidu.com">//2秒后在当前页跳转到百度
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> //指定IE和Chrome使用最新版本渲染当前页面
<meta http-equiv="expires" content="Sunday 22 July 2016 16:30 GMT">
<meta http-equiv="cache-control" content="no-cache">
```





