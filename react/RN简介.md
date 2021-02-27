#### 一. React-Native是什么

Facebook出的JS框架，可以使用react语法编写跨平台的无线应用

#### 二. 特点

1. 跨平台
2. 上手快
3. 热更新

#### 三. 原理

大致流程：

1. 首先通过metro打包成bundle.js文件
2. 然后通过javaScriptCore解析执行bundle
3. 通过bridge调用原生方法

主要线程：

1. **js thread** 

   负责执行解析js文件

2. **Shadow thread** 

   负责生成shadow tree，同时调用yogo将native flex布局转换成原生布局

3. **UI thread**

   负责渲染原生控件，比方说蓝牙

**首先通过js thread生成node节点，然后序列化后调用bridge，bridge再去调用Shadow thread，shadow thread将序列化的字符串解析后，生成对应的节点，然后在序列化调用bridge，最后bridge再去调用UI thread线程渲染页面**

问题：

1. 频繁调用bridge影响性能

2. 每次都序列化和解析需要时间，也会影响性能

#### 四.未来

移除bridge，使用JSI代替。js可以直接调用native方法，不需要通过bridge

0.59版本已经加上 JSI，但是还没正式使用