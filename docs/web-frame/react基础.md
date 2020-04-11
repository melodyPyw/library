# react基础

## react基础知识

### JSX的基本使用

- 基本变量
- 插值表达式
- css class 使用
- css style 使用
- 动态属性
- 渲染插入的html
- 组件的使用，首字母必须大写
- 条件渲染
- 列表渲染

```javascript
render() {
    return (
        <div>
            <p>{this.state.msg}</p>
            <p>{this.state.flag ? 'yes' : 'no'}</p>
            <p className="title">class使用</p>
            <p style={{ fontSize: '16px' }}>style使用</p>
            <p value={this.state.value}>动态属性</p>
            <p dangerouslySetInnerHTML={{__html: '<div>需要渲染的html</div>'}}>插入原生html</p>
            <List></List>
            {
                this.state.flag ? <div>true</div> : <div>false</div>
                // 或者
                this.state.flag && <div>true</div>
            }
            <ul>
                {
                    this.state.data.map((item) => {
                        return <li key={item.id}>{item.value}</li>
                    })
                }
            </ul>
        <div>
    )
}
```

### react中的事件

#### 为什么使用事件需要bind(this)

如果不绑定this，打印this的值为undefined，因为react是合成事件，所有的事件都是在document触发的，所以this指向window，而在class中，默认是严格模式，指向window的this，会变成undefined

```javascript
render() {
    return (
        <button onClick={this.handleClick}>按钮</button>
    )
}
handleClick() {
    console.log(this)  // undefined
}
```

正确写法

```javascript
constructor() {
    this.handleClick.bind(this);
}
render() {
    return (
        <button onClick={this.handleClick}>按钮</button>
    )
}
handleClick() {
    console.log(this);  // 组件实例
    this.setState({
        count: this.state.count + 1
    });
}
//或者使用箭头函数，需要配置可以使用静态方法和静态属性的loader
handleClick = () => {
    console.log(this);  // 组件实例
    this.setState({
        count: this.state.count + 1
    });
}
```

#### event合成事件

合成事件介绍

- 使用event.preventDefault()可以阻止默认行为(比如a标签跳转，表单提交等)
- 使用event.stopPropagation()阻止事件冒泡，防止触发的事件会被父元素监听到
- 使用event.target获取合成事件的触发事件的元素，指向当前绑定事件的元素
- 使用event.currentTarget获取合成事件的最初触发事件的元素，指向当前绑定事件的元素。这是假象，因为event不是原生的MouseEvent对象，而是合成事件的SyntheticEvent对象。
- 使用event.nativeEvent获取原生的event对象
- 使用event.nativeEvent.target获取原生的event对象触发事件的元素，指向当前点击的元素
- 使用event.nativeEvent.currentTarget获取原生的event对象触发事件的元素，指向`document`

SyntheticEvent合成事件对象，为什么使用合成事件

- 模拟了所有的DOM事件和能力，除了window.onscroll和window.resize等不挂载在DOM上面的事件
- event.nativeEvent获取原生的事件对象
- 所有的事件最终都会被挂载到document上
- 和普通的DOM事件，还有Vue事件不一样，Vue事件是挂载在原本的DOM上

```javascript
render() {
    return (
        <button onClick={this.handleClick}>按钮</button>
    )
}
handleClick = (event) => {
    event.preventDefault()      //阻止默认行为
    event.stopPropagation()     //阻止冒泡
    console.log(event.target)   //获取触发事件的元素，指向当前绑定事件的元素
    console.log(event.currentTarget) //获取最初触发事件的元素，指向当前绑定事件的元素。这是假象，因为event不是原生的event对象，而是合成事件的SyntheticEvent对象，原生的是MouseEvent对象
    console.log(event.__propo__.constructor)  //合成事件的包装类
    console.log(event.nativeEvent)  //获取原生的event对象
    console.log(event.nativeEvent.target)  //获取原生的event对象触发事件的元素，指向当前点击的元素
    console.log(event.nativeEvent.currentTarget)  //获取原生的event对象触发事件的元素，指向`document`
}
```

#### 传递参数

传递自定义事件

```javascript
render() {
    return (
        <button onClick={this.handleClick.bind(this, id, value)}>按钮</button>
    )
}

handleClick(id, value, event) {
    console.log('id', id)
    console.log('id', value)
}
```
