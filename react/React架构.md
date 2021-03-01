## React 15架构

React 15架构可分为两层

- Reconciler（协调器）：负责找出变化的组件
- Renderer（渲染器）：负责将变化的组件渲染到页面上

#### Reconciler

React可以通过this.state，this.fouceUpdate，ReactDOM.render，useState等api触发组件更新。

每当页面有更新的时候，Reconciler会做如下操作

- 调用函数组件、或者Class组件的render方法，将JSX装换成虚拟DOM
- 通过和上次的虚拟DOM对比，找出本次变化的虚拟DOM
- 通知Renderer将变化的虚拟DOM渲染到页面

#### Renderer

由于React跨平台支持，不同平台的有不同的Renderer

- ReactDOM 渲染浏览器组件
- ReactNative 渲染APP原生组件
- ReactTest 渲染出纯JS用于测试
- ReactArt 渲染到canvas或者SVG

## React 15架构缺点

React采用递归更新子组件的方式，更新一旦开始，就不能暂停。当递归更新时间超过了16ms的时候，就会造成卡顿



## React 16架构

