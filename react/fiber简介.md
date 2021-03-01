#### 一. 什么是Fiber

React内部一套状态更新机制，支持不同任务的优先级。可中断与恢复，并且恢复后可复用之前的中间状态。每个任务更新的单元为React Element对应的Fiber节点

#### 二. 为什么需要Fibre

在React15及以前，React采用同步递归的方法遍历更新组件树，这样当组件层级很深的话，会造成卡顿

#### 三. 实现









#### 四.参考

https://react.iamkasong.com/process/fiber.html#fiber%E7%9A%84%E8%B5%B7%E6%BA%90