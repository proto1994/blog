### 什么是debounce防抖

防止事件重复执行，在事件结束后的规定时间执行，如果在规定时间内还执行了该事件，则时间重新计算

#### 一. 先来看看常规实现

```js
function debounce(fn, wait) {
  let timerId = null;
  // 注意这里不能用箭头函数，有可能会导致绑定事件的作用域丢失
  return function(...args) {
  	clearTimeout(timerId);
    timerId = setTimeout(() => {
      // apply需要绑定当前作用域
      fn.apply(this, args)
    }, wait)
  }
}
```

要注意`fn.apply`时候必须要把this绑定并且不能返回箭头函数，不然会导致事件函数的`this`丢失，例如：

```js
const input = document.querySelector('input');

// 1.不使用箭头函数
input.addEventListener('input', debounce(function(e) {
  console.log(e.target.value, this)
}, 1000))
// 2.使用箭头函数
input.addEventListener('input', debounce((e) => {
  console.log(e.target.value, this)
}, 1000))
```

1. 当不使用箭头函数的时候，`debounce`函数内部的this是指向调用方的作用域的，这里也就是`fn.apply`绑定的作用域，所以要给`this`。并且`debounce`中返回的函数也不能用箭头函数，不然这里返回函数的`this`作用就发生了改变，不是指向原来绑定的事件的作用域
2. 当使用箭头函数的时候`debounce`中绑定什么都无所谓了，因为箭头函数的的this永远指向函数定义的作用域，这里也就是`window`



这里可以看到常规实现，每次事件重新触发的时候都会执行`clearTimeout`并且重新生成一个定时器。这样感觉不太优雅，那么有办法每次不需要事件执行的时候都重新生成定时器吗？

答案是yes，先把大概思路理下：

1. 用变量`lastCallTime`记录下首次事件触发执行的时间
2. 第一次先在定时器中绑定下任务，延迟时间是传过来的延迟时间`wait`
3. 后面事件又触发了，`lastCallTime`更正又设置成当前时间
4. 等到wait时间到了，触发定时器，定时器函数内部判断下当前时间减掉`lastCallTime`设为`timeSinceLastCall`是否大于wait，如果大于则执行绑定事件，否则的话则重新生成定时器，延迟时间为`wait`减掉`timeSinceLastCall`

按照上面思路实现一个小demo

```js
function debounce(fn, wait) {
  let lastCallTime = 0,
      lastArgs,
      lastThis,
      result,
      timerId = null;

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime;
    return lastCallTime === 0 || timeSinceLastCall >= wait;
  }

  function leadingEdge() {
    timerId = startTime(timerExpired, wait);
    return result;
  } 

  function timerExpired() {
    let dateNow = Date.now();
    if (shouldInvoke(dateNow)) {
      return invokeFunc(dateNow);
    }
    timerId = startTime(timerExpired, remainningWait(dateNow));
  }

  function invokeFunc(time) {
    result = fn.apply(lastThis, lastArgs);
    lastCallTime = 0;
    lastArgs = undefined;
    lastThis = undefined;
    return result;
  }

  function remainningWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    return wait - timeSinceLastCall;
  }

  function startTime(pendingFunc, wait) {
    return setTimeout(pendingFunc, wait);
  }

  function debounced(...args) {
    let dateNow = Date.now();
    const isInvoking = shouldInvoke(dateNow);
    lastCallTime = dateNow;
    lastArgs = args;
    lastThis = this;
    if (isInvoking) {
      return leadingEdge(dateNow)
    }
  }
  return debounced;
}
```

代码加了不少，但也算实现了一个简单的不用每次都重新启动定时器了



下面把lodash的debounce源码贴下，它主要增加了leading和maxWait属性

leading:  指定在延迟开始前调用

maxWait：允许被延迟的最大值

```js
function debounce(func, wait, options) {
  let lastArgs,
    lastThis,
    maxWait,
    result,
    timerId,
    lastCallTime

  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = (!wait && wait !== 0 && typeof requestAnimationFrame === 'function')

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  wait = +wait || 0
  if (options && typeof options === 'object') {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function startTimer(pendingFunc, wait) {
    if (useRAF) {
      cancelAnimationFrame(timerId)
      return requestAnimationFrame(pendingFunc)
    }
    return setTimeout(pendingFunc, wait)
  }

  function cancelTimer(id) {
    if (useRAF) {
      return cancelAnimationFrame(id)
    }
    clearTimeout(id)
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxing
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timerId !== undefined) {
      cancelTimer(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time
    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        timerId = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = startTimer(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}

```





### 参考

1. https://juejin.im/post/6844903609943998477
2. https://juejin.im/post/6844903982297513991