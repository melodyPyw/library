# ECMAScript类型

## 基本类型

六种基本类型 `Undefined`，`Null`，`Boolean`，`String`，`Number`，`Symbol`

### 判断一个值的类型 `typeof`

可以使用`typeof` 来判断一个值是什么类型，会返回值的类型，返回值为字符串。

#### 语法

`typeof` 运算符后接操作数（typeof是一个运算符，但是可以作为一个函数使用）

```javascript
typeof value;
typeof(value);
```

#### 示例

```javascript
typeof 1; // "number"

typeof '1'; // "string"

typeof true; // "boolean"

typeof undefined; // "undefined"

typeof Symbol.for(1); // "symbol"

//上面这些基本类型都可以通过typeof判断数据类型

```

#### 基本类型中的特例`null`

上面五种基本类型都可以通过`typeof`判断，唯独`null`不行。typeof null返回的是"object"。

```javascript
typeof null; // "object"
```

这是一个 bug, 并且由于影响深远，已经无法去修复了。在 JS 的最初版本中使用的是 32 位系统，为了性能考虑使用低位存储变量的类型信息，`000` 开头代表是对象，然而 `null` 表示为全零，所以将它错误的判断为 `object` 。虽然现在的内部类型判断代码已经改变了，但是这个Bug 却是一直流传下来。

如果想使用`typeof`判断null类型，可以这么判断:

```javascript
function isNull(any) {
  return !any && typeof any === "object";
}
```