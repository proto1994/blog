## 使用jest  enzyme对react 单元测试

### 1.测试组件个数

```js
const wrapper = shallow(<FlightPath {...props} />);
it('it should render 5 View component', () => {
  expect(wrapper.find(View).length).toBe(5);
})
```



### 2.测试文字内容是否一致

```js
const wrapper = shallow(<FlightPath {...props} />);
it('it should render Text title is 这些年的飞行足迹', () => {
   expect(wrapper.find(View)
         .at(2).props().children.props.children)
     .toBe(props.flightPath.title);
})

// 或者在组件中增加testID
expect(wrapper.findWhere((node) => node.prop('testID') === 'flightPathLtText').props().children).toBe(props.flightPath.title);
```



### 3.测试组件事件函数参数是否一致

```js
// 组件事件
function jumpUrl() {
  LogUtil.logTrace('c_flt_travelTools_footprint_click');
  Cache.save(Constant.STORAGE_CHEAP_CLICK_FLIGHT_PATH, '1', Constant.STORAGE_CHEAP_CLICK_FLIGHT_PATH_EXPIRE_TIME);
  URL.openURL(flightPath.jumpUrl);
}

// 测试用例
const wrapper = shallow(<FlightPath {...props} />);
it('it should press when click the second TouchableOpacity', () => {
   // @ts-ignore
   LogUtil.logTrace = jest.fn();
   URL.openURL = jest.fn();
   // @ts-ignore
   Cache.save = jest.fn();
  // 在TouchableOpacity组件中绑定了事件
   wrapper.find(TouchableOpacity).at(0).simulate('press');
   expect(LogUtil.logTrace).toBeCalledWith('c_flt_travelTools_footprint_click');  
   expect(URL.openURL).toBeCalledWith(props.flightPath.jumpUrl);  
   expect(Cache.save).toBeCalledWith(Constant.STORAGE_CHEAP_CLICK_FLIGHT_PATH, '1', 		   Constant.STORAGE_CHEAP_CLICK_FLIGHT_PATH_EXPIRE_TIME);
 })
```



### 4. 测试useEffect

```shell
npm install --save-dev --save-exact jsdom jsdom-global
```

```js
import 'jsdom-global/register'; 
 it('test useEffect should log c_flt_travelTools_footprint_show', () => {
         // @ts-ignore
   LogUtil.logTrace = jest.fn();
   const mountWrapper = mount(<FlightPath {...props} />)
    // const wrapper = shallow(<FlightPath {...props} />);
    expect(LogUtil.logTrace).toBeCalledWith('c_flt_travelTools_footprint_show');  
})
```

需要先安装 `jsdom` `jsdom-global` 不然会报下面错误

 **It looks like you called `mount()` without a global document being loaded.**



## 5. 常用jest方法

```js
// 检查对象中是否含有某属性
 expect(wrapperProps).toHaveProperty('columnNums')
```



## 参考

1. [如何对react hooks进行单元测试](https://segmentfault.com/a/1190000020058166)

2. ###### [Jest & enzyme 进行react单元测试](https://juejin.im/post/6844903763526828045)

3. ##### [携程租车React Native单元测试实践](https://www.infoq.cn/article/AYS6fpGLU7jb9kiXHDkC)

4. https://medium.com/@acesmndr/testing-react-functional-components-with-hooks-using-enzyme-f732124d320a

