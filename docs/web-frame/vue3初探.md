# vue3初探

## Proxy

> [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。

使用proxy会比Object.defineProperty性能更好，因为proxy进行深层属性监听的时候，只会在被get的时候，才会去深度监听

### Reflect

> [Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect) 是一个内置的对象，它提供拦截 JavaScript 操作的方法。这些方法与proxy handlers的方法相同。Reflect不是一个函数对象，因此它是不可构造的。

```javascript
const data = {
    name: 'zhangsan',
    age: 20
}

const proxyData = new Proxy(data, {
    get(target, key, receiver) {
        // 原型上面的属性不处理，只处理本身的数据
        const ownKeys = Reflect.ownKeys(target);
        if (ownKeys.includes(key)) {
            console.log('监听属于本身的属性')
            console.log('get', key);
        }

        const result = Reflect.get(target, key, receiver);
        return result;  //返回结果
    },
    set(target, key, val, receiver) {
        //设置重复的属性，不处理
        if (target[key] === val) {
            return true;
        }
        const result = Reflect.set(target, key, val, receiver);
        console.log('get', key, val);
        return result;  //是否设置成功
    },
    deleteProperty(target, key) {
        const result = Reflect.deleteProperty(target, key);
        console.log('deleteProperty', key);
        return result;  //是否删除成功
    },
})
```