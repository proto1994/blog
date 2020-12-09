最近有个关于如下动画的需求，用GIF太大，看了下里面动画比较简单，索性就用动画实现了



![placePath](./placePath.gif)



先分析下这里面涉及到的动画，左上角飞机的还好做，就是**上下移动**，然后地图上的三个点粗看起来也就是从小变大的效果，仔细一看它这个从小到大是**以底部为中心然后变大**的，但`RN`里面没有类似于`css` `transform origin`属性，所以这块较难实现，现在采用了一个折中的方法

下面是用到的RN的动画属性：

**[Animated.timing](https://reactnative.cn/docs/animated#timing)**

下面是官网的介绍

```jsx
static timing(value, config)
```

推动一个值按照一个缓动曲线而随时间变化。[`Easing`](https://reactnative.cn/docs/easing)模块定义了一大堆曲线，你也可以使用你自己的函数。

Config 参数有以下这些属性：

- `duration`: 动画的持续时间（毫秒）。默认值为 500.
- `easing`: 缓动函数。 默认为`Easing.inOut(Easing.ease)`。
- `delay`: 开始动画前的延迟时间（毫秒）。默认为 0.
- `isInteraction`: 指定本动画是否在`InteractionManager`的队列中注册以影响其任务调度。默认值为 true。
- `useNativeDriver`: 启用原生动画驱动。默认不启用(false)。

#### `Animated.sequence`

```jsx
static sequence(animations)
```

按顺序执行一个动画数组里的动画，等待一个完成后再执行下一个。如果当前的动画被中止，后面的动画则不会继续执行。



#### `interpolate` 插值

每个动画的属性都有这个方法，例如：

```js
const flightTranslateY = React.useRef(new Animated.Value(0)).current;
{
  transform: {
    scale: item.aniHandle.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.4, 1],
   })}
  }
}
```



### `stopAnimation()` 结束动画，需要在组件卸载的时候调用

```jsx
stopAnimation([callback]);
```

Stops any running animation or tracking. `callback` is invoked with the final value after stopping the animation, which is useful for updating state to match the animation position with layout.



#### 1.飞机动画实现，主要是轮循动画

```js
// 使用useRef来定义动画属性
const flightTranslateY = React.useRef(new Animated.Value(0)).current;
function ani() {
  Animated.timing(flightTranslateY, {
    toValue: 3,
    duration: 1000,
    delay: 1000
  }).start(() => {
    // 动画结束完后的回调函数
		ani()
	})
}
ani()
```



#### 2. 地标动画实现

```react
// 先定义一组动画， 注意有些时候这里定义的大小需要转换下才能跟style样式的大小一致
const flightPlaceList =  React.useRef([{
   width: 26, 
   height: 32,
   left: 75,
   top: 48,
   // 第一次地标动的时候加个延迟，不然效果不连贯
   delay: 100,
   aniHandle: new Animated.Value(0)
 }, {
   width: 18, 
   height: 22,
   left: 130,
   top: 56,
   aniHandle: new Animated.Value(0)
 }, {
   width: 22, 
   height: 28,
   left: 171,
   top: 30,
   aniHandle: new Animated.Value(0)
 }]).current;

 function aniPlaceScale() {
   // setTimeout可以用来当作动画间隔
   setTimeout(() => {
     flightPlaceList.forEach((item) => {
       // 安卓setValue(0) 无效，需要设置成0.01
       item.aniHandle.setValue(0.01);
     });
     Animated.sequence(flightPlaceList.map((item) => {
       return Animated.timing(              
         item.aniHandle,                      
         {
           toValue: 1,                  
           duration: 500, 
           delay: item.delay || 0,
         }
       );
     })).start(() => {
       aniPlaceScale();
     });
   }, 2500);
 }
aniPlaceScale();

 {
   flightPlaceList.map((item, index) => {
     return (
       <Animated.Image 
         key={index}
         style={[
           {
             position: 'absolute',
             width: item.width,
             height: item.height,
             top: item.top,
             left: item.left,
           },
           { transform: [
             {
               translateY: item.aniHandle.interpolate({
                 inputRange: [0, 0.5, 1],
                 outputRange: [0, -item.height / 2 * 0.4, 0]
               }),
             }, {
               scale: item.aniHandle.interpolate({
                 inputRange: [0, 0.5, 1],
                 outputRange: [0, 1.4, 1],
               })}, ]
           }]} 
         source={{
           uri: `${FlightImgPath}flightPathPlace${index + 1}.png`
         }}
         />
     );
   })
 }
```

这里注意以下几点：

- **安卓setValue(0) 无效，一般解决思路是设置成0.0.1**
- 这里我想实现的动画是想让它从下面放大，而不是中心。**所以放大的时候要改变translateY的值，也就是让它往上移动**



## 参考

1. https://stackoverflow.com/questions/41831300/react-native-animations-translatex-and-translatey-while-scaling

2. https://www.haorooms.com/post/react_native_transformorigin

3. https://github.com/facebook/react-native/issues/25205