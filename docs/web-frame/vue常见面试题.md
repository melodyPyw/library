# vue面试题

## vue常见面试题

### v-show和v-if的区别

- v-show是通过display的属性来控制显示和隐藏
- v-if的组件是真正的渲染和销毁，而不是显示和隐藏
- 频繁切换使用v-show，否则使用v-if

### 为什么在v-for中使用key

- 必须使用key，且不能是index和random
- diff算法是通过tag类型和key值来判断是否是sameNode相同节点
- 减少渲染次数，提升渲染的性能

### 描述Vue的组件生命周期(父子组件)

#### 单组件的生命周期

![avatar](./vue-mianshi/lifecycle.png)

#### 父子组件的生命周期关系

...

### Vue组件如何通讯(常见)

- 父子组件props 和 this.$emit
- 自定义事件event.$on、event.$emit 和event.$off
- vuex

### 描述vue组件渲染和更新过程

watcher通过getter收集依赖，通过setter触发更新
![avatar](./vue-mianshi/data.png)

### v-model的实现原理

- input元素的value = this.modelname
- 通过on绑定input事件this.modelname = $event.target.value
- data更新触发render

### mvvm的理解

...

### computed和watch的特点

...

### 在单文件组件中为什么data必须是一个函数

因为组件的实例需要复用，如果使用的是对象，而对象是引用地址，在同一个模板使用，改了一处，会导致其他使用这个组件的地方也发生变化。使用函数的话，可以每次都返回一个新的引用地址。

### ajax请求应该放在哪个地方

mounted

js是单线程的，使用ajax异步获取数据，放在mounted之前也没有用，只会让逻辑更混乱

### 如何将组件所有的props传递给子组件

`$props`

```javascript
<Children v-bind="$props">
```

### 如何自己实现一个v-model

```javascript
<template>
    <input
        type="text"
        :value="value"
        @input="$emit('change', $event.target.value)"
    >
</template>

<script>
export default {
    model: {
        prop: 'value', //需要对应到props value，要不然会报错，但是不会影响使用
        event: 'change'
    },
    props: {
        value: String
    }
}
</script>
```

### mixin多个组件如何抽离相同的逻辑

mixin

mixin的缺点

### 异步组件

加载大组件
首屏渲染排除不需要使用的组件
路由异步加载

### 什么时候需要使用keep-alive

缓存组件，不需要重复渲染
多个静态tab页切换
优化性能

### 什么时候需要使用berforeDestory钩子

解除绑定的自定义事件 event.$off
清除定时器
解绑自定义的dom事件，比如window.scroll, window.resize等

### 什么是作用域插槽

可以在父组件中通过v-slot使用子组件的数据

父组件

```javascript
<template>
    <slotdata>
        <template v-slot="slotProps">
            {{slotProps.count}}
        </template>
    </slotdata>
</template>
<script>
import slotdata from './slotdata';
export default {
    components: {
        slotdata
    }
}
</script>
```

子组件

```javascript
<template>
    <div>
        <button @click="handleClick">点击</button>
        <slot :count="count"></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0
        }
    },
    methods: {
        handleClick() {
            this.count = this.count + 1;
        }
    }
}
</script>
```

### vuex中的action和muation有什么区别

action中可以处理异步，muation中不可以，muation必须是一个同步的存函数
muation可以做原子操作
action可以整合多个muation

### vue-router常用的路由模式

hash默认
H5 history 需要服务端支持，返回feedback
hash路由一般用在B端后台管理系统中，history路由一般用在C端应用

### 配置Vue-router异步加载

使用import()语法

```javascript
import VueRouter from 'vue-router';

export default new VueRouter ({
    routes: [
        {
            path: '/home',
            component: () => import(/* webpackChunkName: "home" */ './components/home')
        },
        {
            path: '/HelloWorld',
            component: () => import(/* webpackChunkName: "HelloWorld" */ './components/HelloWorld'),
            props: { msg: 'hello world' }
        }
    ]
})
```

### 使用vnode描述一个Dom结构

dom结构

```javascript
<div id="div1" class="container">
    <p>vdom</p>
    <ul style="font-size: 20px">
        <li>a</li>
    </ul>
</div>
```

vnode结构

```javascript
{
    tag: 'div',
    props: {
        id: 'div1',
        className: 'container'
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
                style: 'font-size: 20px;'
            },
            children: [
                {
                    tag: 'li',
                    props: {},
                    children: 'a'
                }
            ]
        }
    ]
}
```

### 监听data变化的核心Api是什么

监听对象的Api: Object.defineProperty

监听数组:

```javascript
// vue源码 https://github.com/vuejs/vue/blob/dev/src/core/observer/array.js
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

//需要拦截的数组方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 * 拦截变异方法并发出事件
 */
methodsToPatch.forEach(function (method) {
    // cache original method 缓存原始方法
    const original = arrayProto[method]
    // 调用原始方法
    const result = original.apply(this, args)
    /*
    * ... 删除部分非核心代码，源码链接可以看到最原始的代码
    */
    // notify change 通知更改，触发更新
    ob.dep.notify()
    return result
})
```

### 请描述响应式原理

怎么监听的data变化，get set watcher
组件渲染和更新的流程

### diff算法的实际复杂度

树的diff比较是O(n^3)，vue做了一些调整。通过同级比较；判断tag元素节点的类型不同，立马删除重建；比对key值得方式进行了优化，将时间复杂度优化到了O(n)。

### diff算法的过程

- 生成vnode
- 通过patch(element, vnode) 和 patch(vnode, vnode)
- patchVnode和addVnodes和removeVnodes
- updateChildren(key值很重要)

### vue为什么是异步渲染，$nextTick有什么用

- 异步渲染将data的修改合并，提高渲染性能
- $next在Dom更新完之后，触发回调

### Vue常见性能优化的方式

- 合理使用v-if和v-show
- 合理使用computed
- v-for中加key，避免和v-if同时使用
- 自定义事件和DOM事件及时销毁
- 合理使用异步组件
- 合理使用keep-alive
- data层级不要太深
- 使用vue-loader在开发环境进行模板预编译
- 图片懒加载(前端通用性能优化)
- C端应用使用SSR

