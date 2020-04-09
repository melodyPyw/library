# vue高级原理

## 组件化

数据驱动视图，不需要自己去操作Dom

Vue MVVM

1. view是视图，model是模型，viewmodel是中间的控制层
2. viewmodel是一个链接层，作用是监听model的变化，从而更新view，监听指令，从而更新model

## 响应式

组件中data的数据一旦发生变化，立刻会触发视图的更新

### 响应式的核心是数据驱动视图

核心Api - Object.defineProperty(vue3使用proxy)

#### 数据驱动视图的基础

> 使用Object.defineProperty往data上面挂载get和set方法
> 在数据修改的时候，会触发set方法，从而更新视图

#### Object.defineProperty进阶

##### 监听对象

```javascript
function observer(target, key) {
    Object.defineProperty(target, key, {
        get() {
            console.log('获取数据') // 获取数据
        },
        set(newValue) {
            if (newValue !==target[key] ) { //这里调用了get方法
                console.log('数据变化') // 数据变化 你好
            }
        }
    });
}
const obj = {
    value: 'hello world'
};
observer(obj, 'value');
obj.value = '你好';
obj.name = 'melody'; //新增属性无法监听
delete obj.value //删除属性无法监听到
```

新增和删除属性时监听不到数据变化，需要使用Vue.set和Vue.delete方法

##### 监听数组

```javascript
function observer(target, key) {
    Object.defineProperty(target, key, {
        get() {
            console.log('获取数据') // 获取数据
        },
        set(newValue) {
            if (newValue !==target[key] ) { //这里调用了get方法
                console.log('数据变化', newValue) //数据变化 hello world
            }
        }
    });
}
const arr = [];
observer(arr, 0)
arr[0] = 'hello world';
```

Object.defineProperty是可以监听数组的变化的，但是无法确定一个数组的长度，如果要全部监听，太消耗性能了。所以vue放弃了监听数组，而是使用了另一种方式，在数组发生变化时，触发更新。

```javascript
const oldArrayProperty = Array.prototype;
const arrProto = Object.create(oldArrayProperty); //创建一个新的对象，将数组的prototype保存下来，然后再拓展arrProperty 上面的方法，就不会污染全局Array的方法
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach((method) => {
    arrProto[method] = function() {
        console.log('数据变化'); //数据变化
        oldArrayProperty[method].call(this, ...arguments);
    }
})
const array = [];
array.__proto__ = arrProto;
array.push('hello world')
```

## 虚拟DOM和Diff算法

### 为什么使用虚拟DOM

- DOM操作非常消耗性能，因为渲染的线程和脚本执行的线程不是同一个，每次操作DOM都涉及两个线程之间的通信
- 用JS模拟DOM，把计算放在JS中，因为JS效率快，可以计算出最小的变更，然后操作DOM

### 什么是虚拟DOM

```html
<div id="div1" class="container">
    <p>vdom</p>
    <ul style="font-size: 20px">
        <li>a</li>
    </ul>
</div>
```

转换成虚拟dom之后是

```javascript
{
    tag: 'div',
    props: {
        className:'container', // class是js中的关键字
        id: 'div1'
    },
    children: [
        {
            tag: 'p',
            props: {},
            children: 'vdom'
        },
        {
            tag: 'ul',
            props: {
                style: 'font-size: 20px'
            },
            children: [
                {
                    tag: 'li',
                    children: 'a'
                }
            ]
        }
    ]
}
```

vue是参考snabbdom实现的虚拟DOM，可以去看看snabbdom怎么实现的

<https://github.com/snabbdom/snabbdom>

### diff算法

#### 什么是diff算法

- diff算法既是对比算法，之前就有的一个很广泛的算法，如linux中的diff命令、git中的diff命令
- js中有成熟的diff库，比对两个js对象的差异<https://github.com/cujojs/jiff>
- 树的diff时间复杂度是O(n^3)，vue和react中对diff算法做了优化，将时间复杂度降到了O(n)

#### vue和react中对diff算法做了那些优化

- 只比较同一层，不去跨级比较
- tag不相同，直接删除重建，不在深度比较
- tag和key相同，两者都相同，则认为是相同节点，不在进行深度比较

同层比较。节点类型发生变更，删除重建。节点类型和key相同，即认为是同一个节点。

### 总结

vdom的核心概念: h函数、vnode、patch函数、diff、key等。
vdom存在的价值: 数据驱动视图，控制DOM操作。

## 模板渲染

模板是vue开发中最常见的东西，它不是html，有插值、指令、js表达式。

vue-template-complier会将模板编译成render函数，执行render函数生成vnode。

### js 的with语法

```javascript
const obj = {
    a: 0,
    b: 1
}

console.log(obj.a); //0
console.log(obj.b); //1
console.log(obj.c); //undefined
```

这是js中常见的取值方式，而with语法可以让你的取值不需要这么麻烦。

```javascript
const obj = {
    a: 0,
    b: 1
}

//使用with，更改变{}内自由变量的查找方式
//将{}内的自由变量，当做obj的属性来查找
with(obj) {
    console.log(a); //0
    console.log(b); //1
    console.log(c); //会报错，Uncaught ReferenceError: c is not defined
}
```

### vue-template-complier编译

普通的语法

```javascript
const compiler = require('vue-template-compiler');

const template = '<div>{{message}}</div>';

const res = compiler.compile(template)

//with(this){return _c('div',[_v(_s(message))])}
// _c = createElement函数
// _v = createTextVNode函数
// _s = toString函数
console.log(res.render)
```

使用v-model，v-model其实就是往节点上面挂载一个事件，然后在将value绑定到节点上

```javascript
const compiler = require('vue-template-compiler');

const template = '<input v-model="name" />';

const res = compiler.compile(template)

/*
    with (this) {
        return _c("input", {
            directives: [
                { name: "model", rawName: "v-model", value: name, expression: "name" },
            ],
            domProps: { value: name },
            on: {
                input: function ($event) {
                    if ($event.target.composing) return;
                    name = $event.target.value;
                },
            },
        });
    }
*/
console.log(res.render)
```

### vue中使用render

vue中除了可以使用template定义组件之外，还可以使用render

```javascript
Vue.component('heading', {
    render(createElement) {
        return createElement(
            'h1',
            [
                createElement('a', {
                    attrs: {
                        name: 'headerId',
                        href: '#' + 'headerId'
                    }
                }, 'this is a tag')
            ]
        )
    }
})
```

### 模板总结

#### 组件初次渲染过程

1. 模板编译到render函数，再到vNode
2. vDom中两种patch(element, vnode)和patch(vnode, newvnode)
3. 模板使用实例上面的变量: with(this) { console.log(a) }

#### 组件更新过程

1. 监听data，并且挂载getter和setter方法，修改data，触发setter(此前在getter中已经被收集到)
2. 重新执行render函数，生成新的newVnode
3. patch(vnode, newVnode)
4. 如果属性的值，放在v-if的节点下面，修改这个值，不会触发模板重新渲染。原因是放在v-if的属性还没有被执行过，没有触发get方法。将v-if设置为true时，重新render的时候，会再次收集属性依赖，这个时候修改属性的值，才会触发模板重新编译。

### 组件异步渲染

1. 多次触发data的修改，只会更新一遍视图
2. 减少Dom的操作次数

## vue中路由

网页URL组成部分

```javascript
//http://127.0.0.1:30001/index.html?id=100&leave=3#/home/search

location.protocol // 'http:'
location.hostname // '127.0.0.1'
location.host     // '127.0.0.1:30001'
location..port    // '30001'
location.pathname // 'index.html'
location.search   // '?id=100&b=20'
location.hash     // '#/home/search'
```

### hash路由

#### 为什么使用hash作为路由

1. hash变化会触发网页跳转，即浏览器的前进、后退
2. hash变化不会刷新页面，SPA必需的特点
3. hash永远不会提交到server端(写在http网络协议里面的)

#### hash路由会触发的api

```javascript
document.addEventListener('click', () => {
    location.hash = '#/home'
}, false)

window.onhashchange = () => {
    console.log('url改变了', location.href)
    console.log('hash改变了', location.hash) // #/home
}
```

### h5 history路由

#### 为什么使用history路由

1. 符合url规范的路由，跳转不会刷新页面
2. history.pushState
3. history.replaceState
4. window.onpopstate

使用h5的history.pushState和history.replaceState更改url，会留下操作浏览器的记录，但是不会引起页面的刷新。这两个api的不同之处在于pushState会增加一条新的访问记录，而replaceState则会替换当前的历史记录。

#### pushState和onpopstate

```javascript
window.history.pushState(state, title, url)
// state需要传递的数据
// title页面标题，一般为null
// url需要替换的页面的路由
 window.onpopstate = (event) => {
    console.log('数据', event)
    console.log('路由改变', location.pathname)
};
```

## vue-原理总结

- 组件化 - 数据驱动视图、MVVM
- 响应式 - Object.definedProperty、深度监听和数组
- vdom和diff - vnode结构、h渲染函数、patch函数
- 模板编译 - with语法，render函数、render执行生成vnode
- 渲染过程 - 首次渲染过程、更新过程、异步渲染、keep-alive、生命周期
- 前端路由 - hash路由、H5 history 、 H5 history需要后端支持feedback

