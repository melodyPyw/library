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