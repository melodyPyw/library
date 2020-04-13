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