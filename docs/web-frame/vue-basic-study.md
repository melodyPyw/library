# vue基础学习

这个文档主要是记录我在学习`vue`中，遇到的一些常见的问题。主要分为两个模块，基本使用和高级特性。

## 基本使用

这是`vue`的基础部分，必须牢固掌握，不管是平时使用还是面试都必须了解的滚瓜烂熟。

### 组件使用

#### 插值和表达式

##### 插值

在`vue`中可以直接使用将`data`或者`computed`中的数据，插入到`template`中。

```vue
<template>
  <div>
    <div>{{value}}</div>            //正常显示
    <div>{{computedValue}}</div>    //正常显示
    <div>{{methodValue()}}</div>    //正常显示，但是不推荐使用，每次重新渲染都会重新执行方法
    <div>{{watchValue}}</div>
    //无法显示，报错
    // Property or method "watchValue" is not defined on the instance but referenced during render
    //属性或方法“watchValue”未在实例上定义，但在呈现期间被引用
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: 'hello wrold'  
    }
  },
  computed: {
    computedValue() {
      return this.value + 'computed';
    }
  },
  watch: {
    watchValue() {
      return this.value + 'watch';
    }
  },
  methods: {
    methodValue() {
      return this.value + 'method';
    }
  }
}
</script>
```

##### 表达式

在模板中还可以使用`JavaScript`表达式，但是不能使用`JavaScript`语句。

```vue
<template>
  <div>
    <div>{{flag ? 'yew' : 'no'}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      flag: false,
    }
  }
}
</script>
```
>
> // 这是语句，不是表达式  
> {{ var a = 1 }}
>
> //流控制也不会生效，请使用三元表达式  
> {{ if (ok) { return message } }}
>

#### 指令和动态属性

- `v-if` 条件渲染，根据表达式的值来有效的渲染内容。当和v-for一起使用时，v-for的优先级更高
- `v-show` 根据表达式的值，切换元素的`display`css属性
- `v-bind` 动态地绑定属性，可以动态传值 :[name]='name'。
- `v-on` 绑定事件监听器，后面会详细介绍
- `v-for` 基于数据多次渲染元素，支持数组，对象，数字，字符串。
- `v-text` 绑定元素的文本子节点，对比使用{{value}}的好处是：在网络差的情况下{{value}}会先显示在页面上，然后闪一下再显示绑定的值
- `v-html` 将内容按普通 HTML 插入，不会作为 Vue 模板进行编译，不能写插值表达式。
- `v-model` 在表单控件或者组件上面创建双向绑定。
- `v-once` 只渲染元素和组件一次，不会重复触发渲染。

##### computed和watch

