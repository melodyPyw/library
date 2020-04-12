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

组件的渲染形式都是按照初始的层级嵌套渲染的，但是Protals可以让组件渲染到父组件之外的节点，在Modal弹窗、页面右侧弹窗等使用很常见。

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

