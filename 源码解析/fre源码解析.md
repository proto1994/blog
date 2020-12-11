最近有时间看了下[fre](https://github.com/yisar/fre.git)的源码，它是一个迷你版的react，内部只支持了React Hooks，里面涵盖了react的**fiber**、**时间分片**、**hooks**、  **diff算法**等知识点。

我将从下面几部分来剖析`fre`的源码

- ##### 时间分片 schedule

- ##### reconcileWork 阶段，生成fiber树

- ##### commit阶段，渲染fiber树

- ##### hooks是怎么实现的

先把[代码](https://github.com/yisar/fre.git)clone下来，从一个简单的demo来看下`fre`的执行逻辑：

```react
import { h, render, useEffect, useState } from "../../src/index";

function App() {
  const [count, setCount] = useState(0);
  // const [two, setTwo] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
    </div>
  );
}

render(<App />, document.body);

```

接下来我们逐行分析`fre`里面的函数代码。

## 1.render

首先来看看`render`函数，打开`reconciler.ts`

```react
let preCommit: IFiber | undefined;
let currentFiber: IFiber;
let WIP: IFiber | undefined;
let commits: IFiber[] = [];
const microTask: IFiber[] = [];

export const render = (
  vnode: FreElement,
  node: Node,
  done?: () => void
): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
    done,
  } as IFiber;
  dispatchUpdate(rootFiber);
};
```

可以看到该文件定义了几个全局变量，这些变量下面会讲到。

1. 先把焦点放到`render`函数，该函数很简单，接收三个参数，第一个是组件，上例中的`<APP />`，第二个是DOM节点，在我们例子中表示的是`body`，第三个可选参数`done`表示后面在说。

2. `render`函数也很简单，里面声明了一个变量`rootFiber`，然后调用了`dispatchUpdate`。这里我们大概看看`rootFiber`的数据结构，如下图可以看到`node`属性是`body`节点，props属性的`children`的`type`属性就是声明的App函数组件

   ![image-20201024130057271](/Users/proto/Library/Application Support/typora-user-images/image-20201024130057271.png)

## 2.dispatchUpdate

接下来我们把目光移到下一个函数`dispatchUpdate`，先看看它的代码

```react
export const dispatchUpdate = (fiber?: IFiber) => {
  if (fiber && !fiber.lane) {
    fiber.lane = true;
    microTask.push(fiber);
  }
  scheduleWork(reconcileWork as ITaskCallback);
};
```

就几行代码。我们一行一行的分析下，

1. 首页该函数接收了一个`fiber`参数，也就是我们在`render`函数里传过来的`rootFiber`参数
2. 再看`if`判断了当`fiber`里的`lane`为空的时候执行，这里我们很明显`rootFiber`中没有声明这个变量`lane`这个变量，所以条件成立， 执行`fiber.lane = true`
3. 并且往`microTask`数组中`push`了第一个`fiber`对象。然后执行了`scheduleWork`函数并且参数是`reconcileWork`函数，可以看到的是`scheduleWork`是从`scheduler.ts`文件中导出来的，那我们打开`scheduler.ts`文件，找到`scheduleWork`函数

## 3.scheduleWork

```react
const macroTask: ITask[] = [];
let deadline: number = 0;
const threshold: number = 1000 / 60;
const callbacks = [];

export const scheduleWork = (callback: ITaskCallback): void => {
  const currentTime = getTime();
  const newTask = {
    callback,
    time: currentTime + 3000,
  };
  macroTask.push(newTask);
  schedule(flushWork);
};

const getTime = () => performance.now();
```

和`reconciler`函数一样，上面也定义了一些全局变量，后面会有使用。我们还是把目光放到`scheduleWork`函数，可以看到该函数接收参数`callback`，这里也就是我们在`dispatchUpdate`函数中传过来的`reconcileWork`函数（这个函数下面会讲）

1. 声明`currentTime` 并且赋值为当前时间[performance.now()](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now) 
2. 声明变量`newTask`对象，有`callback`和`time`两个属性，`callback`是参数传递过来的，`time`为当前时间加上3000，为什么加3000后面在讲
3. 跟`dispatchUpdate`函数类似，将`newTask`添加到`macroTask`数组中
4. 执行`schedule`函数，参数为`flushWork`函数（下面会讲到）

## 4.schedule

再来看看`schedule`函数

```react
export const schedule = (cb) => callbacks.push(cb) === 1 && postMessage();

const postMessage = (() => {
  const cb = () => callbacks.splice(0, callbacks.length).forEach((c) => c());
  if (typeof MessageChannel !== "undefined") {
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = cb;
    return () => port2.postMessage(null);
  }
  return () => setTimeout(cb);
})();
```



1. 接受`scheduleWork`函数中传递的`flushWork`并将该回调函数添加到`callbacks`数组中，然后判断`callbacks`长度为1的时候执行`postMessage`。现在`callback`刚好添加了`flushWork`函数，长度为1，条件满足，执行postMessage`

2. 可以看到`postMessage`是个立即执行函数，代码初始化的时候会先执行并返回了如下函数

   ```js
    // 当浏览器支持MessageChannel的时候
   const postMessage = () => {
     port2.postMessage(null); 
   }
   // 不支持MessageChannel用setTimeout就降级处理
   // 这种情况可以先忽略了，现代浏览器都支持MessageChannel
   const postMessage = () => {
     setTimeout(cb);
   }
   ```

   [MessageChannel](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageChannel)也是一个宏任务事件，降级处理可以用`setTimeout`代替。现在当我们执行`postMessage`的时候，执行`port2.postMessage(null)`。根据MessageChannel文档可知道它会触发`port1.onmessage = cb`，`cb`函数会执行，`cb`是`postMessage`初始化后声明的变量，它触发的时候会将`callbacks`数组中添加的函数执行，这里也就是我们传过来的`flushWork`函数。



## 5.flushWork

那么`flushWork`函数究竟干了什么呢，我们继续往下看

```js
let deadline: number = 0;
const threshold: number = 1000 / 60;
const flushWork = (): void => {
  const currentTime = getTime();
  deadline = currentTime + threshold;
  flush(currentTime) && schedule(flushWork);
};
const getTime = () => performance.now();
```

啊哦，`flushWork`函数看起来也很简单，就3行代码，看来还没挖到宝藏。先还是简单分析下函数的逻辑：

1. 又声明了`currentTime`为当前时间
2. 给`scheduler`文件中的全局变量`deadline`赋值为当前时间加上`threshold`（大概是16.6，后面解释为什么加16.6）
3. 执行`flush`函数，并将当前时间`currentTime`作为参数传递，同时如果该函数返回`true`还会执行`schedule(flushWork)`

最后`schedule(flushWork)`跟`scheduleWork`函数中最后执行的代码是一样的。为什么这样做呢，看来答案全都在`flush`函数中了，让我们打气精神来，把眼睛擦亮点。宝藏全在`flush`中了

## 6.flush

```react
// 全局变量是为了方便查看直接搬过来的
const macroTask: ITask[] = [];
let deadline: number = 0;
const threshold: number = 1000 / 60;
const callbacks = [];

const flush = (initTime: number): boolean => {
  let currentTime = initTime;
  let currentTask = peek(macroTask);

  while (currentTask) {
    const timeout = currentTask.time <= currentTime;
    if (!timeout && shouldYield()) break;

    const callback = currentTask.callback;
    currentTask.callback = null;

    const next = callback(timeout);
    next ? (currentTask.callback = next as any) : macroTask.shift();

    currentTask = peek(macroTask);
    currentTime = getTime();
  }
  return !!currentTask;
};

const peek = (queue: ITask[]) => {
  queue.sort((a, b) => a.time - b.time);
  return queue[0];
};
```



主角终于登场了，这应该就是我们要找的宝藏了。大概看看`flush`函数，接收`initTime`参数，返回一个`boolean`值，这跟`flushWork`函数最后执行的逻辑对应上了。好，那让我们深挖下这里的秘密

1. 将函数参数赋值给`crrrentTime`，也就是当前时间

2. 从`macroTask`取出一个任务赋值给`currentTask`，看`peek`函数，先把`macroTask`按时间从小到大排序，然后返回第一个，也就是最先加进`macroTask`的任务，这里也就是`scheduleWork`函数中加入的`newTask`

3. 下面是一段`while`循环，当`currentTask`为空的时候跳出循环，我们再来仔细分析下这段代码

   ```js
   while (currentTask) {
       const timeout = currentTask.time <= currentTime;
       if (!timeout && shouldYield()) break;
   
       const callback = currentTask.callback;
       currentTask.callback = null;
   
       const next = callback(timeout);
       next ? (currentTask.callback = next as any) : macroTask.shift();
   
       currentTask = peek(macroTask);
       currentTime = getTime();
     }
   
   export const shouldYield = (): boolean => {
     return getTime() >= deadline;
   };
   ```

   3.1 第一行判断`currentTask`的时间是否小于当前时间`currentTime`，然后赋值给`timeOut`

   3.2 当`timeOut`为`false`的时候，即`currentTask.time > currentTime`，并且当前时间大于`deadline`，就跳出循环。这里先解释下`scheduleWork`函数中为什么`newTask`的`time`为什么需要加3000，3000相当于任务的最晚处理时间，当时间超过这个阈值的时候，该任务一定要被执行掉。然后再解释下为什么在`flushWork`函数中为什么`deadline`需要加`threshold（16.6）`，**16.6**相当于时间分片的最小单位，即在当前任务的阈值内每隔**16.6ms**会跳出循环，检查下还有没有其他高优先级的任务执行。我们先假设循环没有`break`，看看下面的代码

   3.3 取出`currentTask`中的`callback`赋值给`callback`，并且将任务清空

   3.4 关键的时候来了，执行`callback`并将`timeOut`作为参数传递。这里的`callback`是上一步的`currentTask`中的`callback`，也是`scheduleWork`中的`newTask`中的`callback`，最后也是在`dispatchUpdate`函数中传递给`scheduleWork`函数中的参数`reconcileWork`

   3.5 这里需要暂停下 ：）



好了，问题好像又回到了最初的地方了。让我们先总结下上面发生了

1. 执行`render`函数，生成`rootFiber`
2. 将`rootFiber`传递给`dispatchUpdate`，将`rootFiber`加入到任务队列，执行`scheduleWork`
3. 创建时间分片中的任务，将`reconcileWork`插入到任务队列中
4. 执行`schedule(flushWork)`，触发时间分片任务
5. `flushWork`，赋值`deadline`
6. `flush`
7. 执行`reconcileWork`



## 7.reconcileWork

那么，让我们把目光回到`reconcileWork`函数中来

```js
let preCommit: IFiber | undefined;
let WIP: IFiber | undefined;
const microTask: IFiber[] = [];

const reconcileWork = (timeout: boolean): boolean => {
  if (!WIP) WIP = microTask.shift();
  while (WIP && (!shouldYield() || timeout)) WIP = reconcile(WIP);
  if (WIP && !timeout) return reconcileWork.bind(null);
  if (preCommit) commitWork(preCommit);
  return null;
};

// scheduler文件中的函数，这个为了阅读方便，复制过来
export const shouldYield = (): boolean => {
  return getTime() >= deadline;
};
```

可以看到`reconcileWork`接收一个参数`timeOut`，返回一个**boolean**值，`timeOut`也就是`flush`函数循环中的`currentTask.time <= currentTime`，我们先老规矩，一行一行的来分析下

1. 首先先判断全局变量`WIP`为空的时候从`microTask`数组中取第一个任务，也就是首先加进去的任务
2. 当`WIP`存在，并且`shouldYield()`为**false**，也就是**16.6ms**之内或者**timeout**等于**true**，结合`currentTask.time <= currentTime`就是在**3000ms**之后。这里可以理解为当任务的声明时间大于**3000ms**的时候，就会一直执行这个循环，直到**WIP**为空
3. 我们先假设条件满足，此时循环里面执行了新的函数`reconcile`，参数为`WIP`，并且函数`reconcile`执行完之后又将结果返回给`WIP`
4. 未完待续

我们先跟随镜头，来看看`reconcile`函数的实现吧

## 8.reconcile

```js
const getParentNode = (WIP: IFiber): HTMLElement | undefined => {
  while ((WIP = WIP.parent)) {
    if (!isFn(WIP.type)) return WIP.node
  }
}
export const isFn = (x: any): x is Function => typeof x === 'function'

const reconcile = (WIP: IFiber): IFiber | undefined => {
  WIP.parentNode = getParentNode(WIP) as HTMLElementEx
  isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP)
  WIP.lane = WIP.lane ? false : 0
  WIP.parent && commits.push(WIP)

  if (WIP.child) return WIP.child
  while (WIP) {
    if (!preCommit && WIP.lane === false) {
      preCommit = WIP
      return null
    }
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

```

1. 接收`WIP`参数，这里也就是`render`函数中的`rootFiber`
2. 给`WIP`对象加父节点`parentNode ` 属性，由于`rootFiber` 是根节点，它就没有父节点
3. 再看第十行，判断`WIP`对象的`type`属性是否是一个函数，这里`rootFiber`没有`type`属性，不是函数，所以会执行`updateHost`

4. 先看看[updateHost](#9.updateHost)函数的实现
5. 

## 9.updateHost 

```JS
const updateHost = (WIP: IFiber): void => {
  if (!WIP.node) {
    if (WIP.type === 'svg') {
      WIP.op |= (1 << 4)
    }
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  const p = WIP.parentNode || {}
  WIP.insertPoint = (p as HTMLElementEx).last || null
    ; (p as HTMLElementEx).last = WIP
    ; (WIP.node as HTMLElementEx).last = null
  reconcileChildren(WIP, WIP.props.children)
}
```

1. 接收`WIP`参数，这里依旧还是`rootFiber` 
2. 看第一行的判断语句，没有`node`属性的时候，进入条件，显然`rootFiber`是有节点的，就是`body`
3. 执行到第八行，`WIP`是没有`parentNode`节点的，所以`p`这里等于`{}`
4. 第九行给`WIP`属性加了`insertPoint`节点等于`WIP`父节点的last属性，这里对于根节点来说还是等于`null`，后面`insertPoint`这个属性会有说到
5. 第十行是给`WIP`的父元素加了个`last`节点等于`WIP`
6. 第十一行清除`WIP`本身的`last`属性
7. 执行[reconcileChildren](#10.reconcileChildren)函数，参数为`WIP`和`WIP.props.children`，那再看看它的实现

## 10.reconcileChildren

```JS
const reconcileChildren = (WIP: IFiber, children: FreNode): void => {
  delete WIP.child
  const oldFibers = WIP.kids
  const newFibers = (WIP.kids = hashfy(children as IFiber))
  const reused = {}
  for (const k in oldFibers) {
    const newFiber = newFibers[k]
    const oldFiber = oldFibers[k]
    if (newFiber && newFiber.type === oldFiber.type) {
      reused[k] = oldFiber
    } else {
      oldFiber.op |= (1 << 3)
      commits.push(oldFiber)
    }
  }
  let prevFiber: IFiber | null
  for (const k in newFibers) {
    let newFiber = newFibers[k]
    const oldFiber = reused[k]
    if (oldFiber) {
      oldFiber.op |= (1 << 2)
      newFiber = { ...oldFiber, ...newFiber }
      newFiber.lastProps = oldFiber.props
      if (shouldPlace(newFiber)) {
        newFiber.op &= (1 << 1)
      }
    } else {
      newFiber.op |= (1 << 1)
    }
    newFibers[k] = newFiber
    newFiber.parent = WIP
    if (prevFiber) {
      prevFiber.sibling = newFiber
    } else {
      if (WIP.op & (1 << 4)) {
        newFiber.op |= (1 << 4)
      }
      WIP.child = newFiber
    }
    prevFiber = newFiber
  }
  delete prevFiber?.sibling
}
```

这个函数稍微有点长，我们还是逐行分析下

1. 首先接收`WIP`和`children`为参数，`children`这里是App组件

2. 首先第一行，删除`WIP`的`child`节点，这里首页`WIP`没有`child`节点，删了个寂寞 : )

3. 取出`WIP`的`kids`属性，这里`WIP`还没赋值这个参数，所以还是`null`

4. 第四行给`WIP`对象加`kid`属性，通过`hashfy`这个函数来生成，参数为`children`我们先来看看`hashfy`内部的原理

   ```js
   export const some = (v: any) => v != null && v !== false && v !== true
   const hs = (i: number, j: string | number | null, k?: string): string =>
     k != null && j != null ? '.' + i + '.' + k : j != null ? '.' + i + '.' + j : k != null ? '.' + k : '.' + i
   const hashfy = <P>(c: IFiber<P>): FiberMap<P> => {
     const out: FiberMap<P> = {}
     isArr(c)
       ? c.forEach((v, i) => (isArr(v) ? v.forEach((vi, j) => (out[hs(i, j, vi.key)] = vi)) : some(v) && (out[hs(i, null, v.key)] = v)))
       : some(c) && (out[hs(0, null, (c as any).key)] = c)
     return out
   }
   ```

   4.1. 第五行先声明一个对象out，可以看到这个对象的是键值对是{key: fiber} 结构的

   4.2. 再判断传过来的参数是不是一个数组，这里的参数c是个对象并且some(c) 为true，所以根据out生成的结果是`hs(0, null, (c as any).key) = '.0'`

   4.3. 返回`out = {'.0': c}` 

   所以最后的结果是` WIP.kids = {'.0': children}` ，可以看到这里是把WIP的子元素用对象的形式保存下来，  **前面加`.`是为了后面for in 循环的时候按照这个插入顺序遍历**

5. 再往下看第5行，声明了一个reused变量

6. 6-15行，由于oldFibers等于null，这里先不执行

7. 下面来看看16-41的这个循环干的事情

   ```js
   let prevFiber: IFiber | null
   for (const k in newFibers) {
     let newFiber = newFibers[k]
     const oldFiber = reused[k]
     if (oldFiber) {
       oldFiber.op |= (1 << 2)
       newFiber = { ...oldFiber, ...newFiber }
       newFiber.lastProps = oldFiber.props
       if (shouldPlace(newFiber)) {
         newFiber.op &= (1 << 1)
       }
     } else {
       newFiber.op |= (1 << 1)
     }
     newFibers[k] = newFiber
     newFiber.parent = WIP
     if (prevFiber) {
       prevFiber.sibling = newFiber
     } else {
       if (WIP.op & (1 << 4)) {
         newFiber.op |= (1 << 4)
       }
       WIP.child = newFiber
     }
     prevFiber = newFiber
   }
   ```

   7.1 第一行声明一个prevFiber对象，看名字应该是存储的是上一个fiber

   7.2 然后遍历newFibers对象，上面我们得到`newFibers={'.0': children}`,所以`k='.0'`

   7.3 

