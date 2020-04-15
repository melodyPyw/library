# react高级

## react高级知识点

### 函数组件

函数组件没有生命周期钩子，只有render。函数组件的参数有两个，第一个是props，第二个是context。

```javascript
export default function funcomponent(props, context) {
    console.log('context', context)
    return (
        <ul>
            {
                props.list.map((item) => {
                    return (
                        <li key={item.id}>{item.value}</li>
                    )
                })
            }
        </ul>
    )
}
```

### 非受控组件和ref

非受控组件获取组件的value需要使用ref，定义初始数据需要使用defaultValue或defaultChcked。

```javascript
class App extends React.Component {
  state = {
    value: 'defaultValue',
    flag: true
  }
  constructor(props) {
    super(props);
    // React.createRef()形式绑定ref
    this.radioRef = React.createRef();
  }
  //函数形式绑定ref
  funRef = (ref) => this.radio = ref
  handleClick = () => {
    //字符串形式绑定ref
    console.log(this.refs.input.value);
    console.log(this.radio.checked);
    console.log(this.radioRef.current.checked)
  }
  render() {
    const { value, flag } = this.state;
    return (
      <div>
        <input type="text" defaultValue={value} ref="input"/>
        <input type="checkbox" defaultChecked={flag} ref={this.funRef}/>
        <input type="radio" defaultChecked={flag} ref={this.radioRef} />
        <button onClick={this.handleClick}>获取input数据</button>
      </div>
    )
  }
}
```

#### 绑定ref的三种方式

1. string类型绑定。vue中绑定ref也是使用这种方式，通过this.ref获取绑定到ref的名字的dom节点，这种方式在最新版react不推荐使用。
2. 函数形式ref可以传递一个字符串或者函数，如果传递函数的话，函数的第一个参数就是绑定ref的Dom的节点
3. 使用React.createRef()的返回值保存到一个变量，将变量绑定到节点的ref属性上，变量的current指向绑定的标签Dom。

#### 非受控组件的使用场景

1. 必须操作Dom元素，setState实现不了，比如拖拽组件等
2. 文件上传`<input type="file" />`
3. 富文本编辑器，需要插入Dom元素

### Protals 传送门

组件的渲染形式都是按照初始的层级嵌套渲染的，但是Protals可以让组件渲染到父组件之外的节点，在Modal弹窗组件、页面右侧弹窗组件等使用很常见。

```javascript
//父组件
class App extends React.Component {
  state = {
    msg: 'hello world'
  }
  render() {
    return (
      <div>
        <ProtalsModal msg={this.state.msg} />
      </div>
    )
  }
}

//子组件
export default class ProtalsModal extends React.Component {
    render() {
        return ReactDom.createPortal(
            <div className='modal'>{this.props.msg}</div>,
            document.querySelector('#root')
        )
    }
}
```

需要注意的是createPortal是ReactDom上面的方法，第一个参数传入需要挂载的组件实例，第二个参数是要挂载到的DOM节点。

### context上下文

>Context 通过组件树提供了一个传递数据的方法，从而避免了在每一个层级手动的传递 props 属性

老的使用方式(还可以使用，但是不推荐)

```javascript
// 父组件
import React from 'react';
import propsCheck from 'prop-types' 
import ContextDemo from './contextDemo'

export default class App extends React.Component {
  state = {
    msg: 'hello world'
  }
  static childContextTypes = {
    msg: propsCheck.string.isRequired
  }
  getChildContext() {
    return {
      msg: this.state.msg
    }
  }
  render() {
    return (
      <div>
        <p>createPortals</p>
        <ContextDemo></ContextDemo>
      </div>
    )
  }
}

// 中间业务代码
import React from 'react'
import ProtalsModal from './protalsModal'

export default () => {
    return (
        <div>
            <ProtalsModal />
        </div>
    )
}

// 接受使用context的组件
import React from 'react'
import ReactDom from 'react-dom'
import propsCheck from 'prop-types'

export default class ProtalsModal extends React.Component {
    constructor(props, context) {
        super(props)
        this.state = {
            msg: context.msg
        }
    }
    static contextTypes = {
        msg: propsCheck.string.isRequired
    }
    render() {
        return ReactDom.createPortal(
            <div className='modal'>{this.state.msg}</div>,
            document.querySelector('#root')
        )
    }
}
```

老的context定义方式，需要在组件里面写一个getChildContext的钩子，然后需要在父组件和需要使用context的组件，定义context的类型。

16.3版本之后的context使用方式

```javascript
//父组件
import React from 'react'
import ContextDemo from './contextDemo'
import Context from './context'

export default class App extends React.Component {
  state = {
    msg: 'hello world'
  }
  render() {
    return (
      <div>
        <Context.Provider value={this.state.msg}>
          <p>createPortals</p>
          <ContextDemo></ContextDemo>
        </Context.Provider>
      </div>
    )
  }
}

// context.js的内容
import React from 'react'

export default React.createContext('')

// 使用contxet的组件，需要定义一个静态变量contextType
import React from 'react';
import ReactDom from 'react-dom'
import Context from './context'
import './App.css'

export default class ProtalsModal extends React.Component {
    static contextType = Context

    render() {
        return ReactDom.createPortal(
            <div className='modal'>{this.context}</div>,
            document.querySelector('#root')
        )
    }
}

//或者使用Consumer，这两种方式是等价的，Context.Consumer更多使用在函数式组件里面
import React from 'react';
import ReactDom from 'react-dom'
import Context from './context'
import './App.css'

export default class ProtalsModal extends React.Component {
    render() {
        return ReactDom.createPortal(
            <Context.Consumer>
                {
                    (context) => {
                        return <div className='modal'>{context}</div>
                    }
                }
            </Context.Consumer>,
            document.querySelector('#root')
        )
    }
}
```

### 异步加载组件

```javascript
import React from 'react'

const LazyComponent = React.lazy(() => import('./LazyComponent'));

class App extends React.Component {
  render() {
    return (
      <div>
        <React.Suspense fallback={<div>Loading...</div>}>
          <LazyComponent></LazyComponent>
        </React.Suspense>
      </div>
    )
  }
}
```

使用React.lazy加载组件，这个api接受一个函数参数，这个函数必须返回一个JSX组件。

React.Suspense是一个虚拟组件，可以放在Lazy组件上方的任意位置，并且可以在Lazy组件没加载出来之前，先显示fallback的内容。

### React中的性能优化shouldComponentUpdate

必须掌握，面试的时候经常会问。

在react中，父组件更新，所有子组件无条件更新。

```javascript
// 父组件
import React from 'react'
import UpdateComponent from './updateComponent'

class App extends React.Component {
  state = {
    value: ''
  }
  componentDidMount() {
    this.setState({
        value: 'hello world'
    })
  }
  componentDidUpdate() {
    console.log('father_update')
  }
  render() {
    return (
      <div>
          <p>{this.state.value}</p>
          <UpdateComponent></UpdateComponent>
      </div>
    )
  }
}

// 子组件
export default class UpdateComponent extends React.Component {
    state = {
        count: 0
    }
    componentDidUpdate() {
        console.log('children_update')
    }
    render() {
        return (
            <div>{this.state.count}</div>
        )
    }
}

// 打印日志
// children_update
// father_update
```

如果要在子组件禁止更新，可以使用shouComponentUpdate()。shouComponentUpdate返回false将会禁止本次更新，shouComponentUpdate默认返回true。

```javascript
// 子组件
export default class UpdateComponent extends React.Component {
    state = {
        count: 0
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (this.state.count !== nextState.count) {
            return true
        }
        return false
    }
    componentDidUpdate() {
        console.log('children_update')
    }
    render() {
        return (
            <div>{this.state.count}</div>
        )
    }
}
// 打印日志
// father_update  只有父组件触发了一次更新
```

### PureComponent 和 React.memo

PureComponent = ClassComponent + shouldComponentUpdate浅比较

React.memo = FunctionComponent + shouldComponentUpdate

大部分情况下PureComponent和React.memo已经够用了，不需要手动去进行深度比较，特别是在UI组件里面

```javascript
// PureComponent使用方法
export default class App extends React.PureComponent {
    render() {
        return (
            <div>hello world</div>
        )
    }
}

// React.memo使用方法
export default React.memo((props) => {
    return (
        <div>{props.msg}</div>
    )
})
```

memo接受两个参数，第一个参数是要渲染的组件，第二个参数是propsAreEqual函数，返回false则会重新渲染，放回true不会重新渲染，和shouldComponentUpdate正好相反

```javascript
export default React.memo((props) => {
    return (
        <div>{props.msg}</div>
    )
}, (prevProps, nextProps) => {
    return prevProps.msg === nextProps.msg;
})
//上面的memo代码等价于
export default class Memo extends React.Component {
    shouldComponentUpdate(prevProps) {
        return prevProps.msg !== this.props.msg;
    }
    render() {
        return (
            <div>{this.props.msg}</div>
        )
    }
}
```

### ImmutableJS 和不可变值

基于共享数据，速度好，不可变值。

> Immutable不可变值: 指的是数据一旦创建，就不能再被更改，任何修改或添加删除操作都会返回一个新的 Immutable 对象。

常用API总结

```javascript
import immutable from 'immutable'

//Map()  原生object转Map对象 (只会转换第一层，注意和fromJS区别)
immutable.Map({name:'danny', age:18})

//List()  原生array转List对象 (只会转换第一层，注意和fromJS区别)
immutable.List([1,2,3,4,5])

//fromJS()   原生js转immutable对象  (深度转换，会将内部嵌套的对象和数组全部转成immutable)
immutable.fromJS([1,2,3,4,5])    //将原生array  --> List
immutable.fromJS({name:'danny', age:18})   //将原生object  --> Map

//toJS()  immutable对象转原生js  (深度转换，会将内部嵌套的Map和List全部转换成原生js)
immutableData.toJS();

//查看List或者map大小  
immutableData.size
immutableData.count()

// is()   判断两个immutable对象是否相等
immutable.is(imA, imB);

//merge()  对象合并
var imA = immutable.fromJS({a: 1, b: 2});
var imA = immutable.fromJS({c: 3});
var imC = imA.merge(imB);
console.log(imC.toJS())  //{a:1,b:2,c:3}

//增删改查（所有操作都会返回新的值，不会修改原来值）
var immutableData = immutable.fromJS({
    a: 1,
    b: 2，
    c: {
        d: 3
    }
});
var data1 = immutableData.get('a') //  data1 = 1  
var data2 = immutableData.getIn(['c', 'd']) // data2 = 3   getIn用于深层结构访问
var data3 = immutableData.set('a' , 2);   // data3中的 a = 2
var data4 = immutableData.setIn(['c', 'd'], 4);   //data4中的 d = 4
var data5 = immutableData.update('a',function(x){return x+4})   //data5中的 a = 5
var data6 = immutableData.updateIn(['c', 'd'],function(x){return x+4})   //data6中的 d = 7
var data7 = immutableData.delete('a')   //data7中的 a 不存在
var data8 = immutableData.deleteIn(['c', 'd'])   //data8中的 d 不存在
```

### React性能优化小结

1. state使用不可变的数据
2. shouldCompoentUpdate
3. PureComponent和memo
4. ImmutableJS
5. state的层级不宜过深
6. 按需加载

### 高阶组件

高阶组件不是一个API，而是一种模式，类似于工厂模式或者装饰器模式。

传入一个组件，返回一个新的组件。

```javascript
const HOCFactory = (Component) => {
  return class HOC extends React.component {
    render() {
      return <Component {...this.props}>
    }
  }
}
```

react-redux就是一个高阶组件

### render props

```javascript
// 最外层组件
import RenderProps from './RenderProps'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <RenderProps render={(msg) => <div>{msg}</div>}></RenderProps>
      </div>
    )
  }
}

// RenderProps组件
export default class RenderProps extends React.Component {
    state = {
        msg: 'hello world'
    }
    render() {
        return (
            <div>
                {
                    this.props.render(this.state.msg)
                }
            </div>
        )
    }
}
```

### redux的使用

#### 单项数据流

![avatar](./react-assets/redux.jpg)

#### 使用react-redux传递store

React-Redux 将组件分成两大类：UI 组件（presentational component）和容器组件（container component）

##### UI组件

- 只负责UI的呈现，不带有业务逻辑
- 没有状态，不使用this.state，数据全部通过this.props渲染

##### 容器组件

- 负责管理数据和业务逻辑
- 使用 Redux 的 API

##### Provider 和connect

react-redux只有两个APi，Provider和connect，Provider负责挂载数据，connect负责使用数据

```javascript
// 将store挂载在最外层，允许所有子组件通过connect拿到数据
import { Provider } from 'react-redux'
import store from './store'
import App from './components/App'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

//connect
class App extends Component {
  render() {
    const { count, handleClick } = this.props
    return (
      <div>
        <span>{value}</span>
        <button onClick={handleClick}> +1 </button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

//  将state映射到组件的props
function mapStateToProps(state) {
  return {
    count: state.count
  }
}

//  将action映射到组件的props
function mapDispatchToProps(dispatch) {
  return {
    handleClick: () => dispatch({type: 'INCREASE_COUNT'})
  }
}

// Reducer   基于原有state根据action得到新的state
function reducer(state = { count: 0 }, action) {
  const count = state.count
  switch (action.type) {
    case 'INCREASE_COUNT':
      return { count: count + 1 }
    default:
      return state
  }
}
```

#### 异步action

redux只支持同步的action，如果要使用异步action，需要引入第三方中间件

```javascript
// 安装redux-thunk插件
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducer'

const store = createStore(reducers, applyMiddleware(thunk))

// 同步action
export const handleClick = (count) => {
  return {
    type: 'INCREASE_COUNT',
    count
  }
}

// 异步action
export const handleClickSync = (count) => {
  return (dispatch) => {
    fetch(url).then(res => {
      dispatch({
        type: 'INCREASE_COUNT',
        count: count + res.count
      })
    })
  }
}
```

#### redux中间件原理

redux-thunk源码

```javascript
// 外层
function createThunkMiddleware (extraArgument){
     // 第一层
    return function ({dispatch, getState}){
       // 第二层
        return function (next){
            // 第三层
            return function (action){
                if (typeof action === 'function'){
                    return action(dispatch, getState, extraArgument);
                }
                return next(action);
            };
        }
    }
}

let thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

