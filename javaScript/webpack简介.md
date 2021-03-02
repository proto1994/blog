#### 一. webpack打包原理

#### 二. 什么是loader

loader是文件加载器，能够加载文件资源，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件夹中

1. 处理一个文件可以使用多个loader，loader的执行顺序和配置中的顺序是相反的。即最后一个loader最先执行，第一个loader最后执行
2. 第一个执行的loader接收文件内容作为参数，其他loader接收前一个执行的loader返回值作为参数，最后执行的loader会返回模块的javaScript源码

#### 三. 什么是plugin

在webpack运行的声明周期中会广播出许多事件，plugin可以监听这些事件，在合适的时机通过webpack提供的API改变输出结果

#### 四. loader和plugin的区别

对于loader，它是一个转换器，将A文件进行编译成B文件，这里操作的是文件，比如将A.scss转换成A.CSS，单纯文件的转换过程

plugin是一个扩展器，它丰富了webpack本身，针对loader结束后，webpack打包的整个过程，它并不是直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛任务



