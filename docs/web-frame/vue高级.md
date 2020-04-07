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

### 虚拟DOM和Diff算法

#### 为什么使用虚拟DOM

- DOM操作非常消耗性能，因为渲染的线程和脚本执行的线程不是同一个，每次操作DOM都涉及两个线程之间的通信
- 用JS模拟DOM，把计算放在JS中，因为JS效率快，可以计算出最小的变更，然后操作DOM

#### 什么是虚拟DOM

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

#### diff算法

##### 什么是diff算法

- diff算法既是对比算法，之前就有的一个很广泛的概念，如linux中的diff命令、git中的diff命令
- js中有成熟的diff库，比对两个js对象的差异<https://github.com/cujojs/jiff>
- 树的diff时间复杂度是O(n^3)，vue和react中对diff算法做了优化，将时间复杂度降到了O(n)

##### vue和react中对diff算法做了那些优化

- 只比较同一层，不去跨级比较
- tag不相同，直接删除重建，不在深度比较
- tag和key相同，两者都相同，则认为是相同节点，不在进行深度比较

同层比较。节点类型发生变更，删除重建。节点类型和key相同，即认为是同一个节点。

