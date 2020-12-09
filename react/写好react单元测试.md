写了几周的React的单元测试，这几天找到了点感觉。单测像个代码管家，让你可以安心的重构代码。今天也是重构的代码的时候出现了问题，然后跑单测的时候发现了

#### 什么写单测

最好在项目基本完成的时候，开始写单元测试，这样可保证后面重构的时候前期写的功能点不会出问题

### 单测怎么写

1. 先检查页面渲染的文字标题，动态的样式，埋点是否正确，这里用`shallow`就行
2. 测试页面埋点
3. 测试交互，项目复杂的话可能有多种情况，可以分开写

这里重点说下第三种情况：

```js
  it("测试副推曝光埋点", (done) => {
    // 需要使用mount， shallow useEffect方法不会触发
    const wrapper = mount(<ToolEntry {...props} />);
     
     // 使用mount，会找到多个节点，这里取第一个就行
    expect(wrapper.findWhere((node) => node.prop('testID') === 'toolEntryPagination').first().props().children[0].props.style[1].backgroundColor).toBe('#0086f6');
    // 直接调用方法，使用simulate 会报错
    // 滑到右侧
    wrapper.find(ScrollView).first().props().onMomentumScrollEnd({
      nativeEvent: {
        contentOffset: {
          x: 1000
        }
      }
    })
    // @ts-ignore
    logTrace = jest.fn();
    act(() => {
      wrapper.update()
    })
    expect(wrapper.findWhere((node) => node.prop('testID') === 'toolEntryPagination').first().props().children[1].props.style[1].backgroundColor).toBe('#0086f6');
    props.secondaryList.map((item, index) => {
      expect(logTrace).toBeCalledWith(ToolEntryCodeAndTraceLogMap[item.code]('s')); 
    });
    // 滑到左侧
    wrapper.find(ScrollView).first().props().onMomentumScrollEnd({
      nativeEvent: {
        contentOffset: {
          x: 0
        }
      }
    })

    // 必须在update前赋值函数
    // @ts-ignore
    logTrace = jest.fn();
    act(() => {
      wrapper.update()
    })
    expect(wrapper.findWhere((node) => node.prop('testID') === 'toolEntryPagination').first().props().children[0].props.style[1].backgroundColor).toBe('#0086f6');
    // 测试主推埋点
    expect(logTrace).toBeCalledTimes(props.primaryList.length)
    done();
 })

```

