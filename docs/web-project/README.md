Why为什么要做前端工程化？
收敛和约束
收敛
收敛各条业务线技术栈，抽离公共组件库、公共项目配置，减少团队重负性工作
约束
保证代码的健壮性，统一团队的代码风格
What什么是前端工程化？
模块化
模块化划分
commonjs
通过module.exports的方式导出模块，通过require的方式引入模块
commonjs导出的值是值的拷贝，es module导出的是值的引用
commonjs可以写在动态语法的判断里，ES Module静态语法只能写在顶层
es module
通过export default的方式导出模块，通过import from的方式引入模块，如果需要动态引入模块可以通过import()方法引入
es module的引入方式是静态的，所以不能放在条件判断语句和循环语句中引入
webpack 性能优化中的tree shaking依赖的就是es module的静态导入，判断模块这个模块中没有使用的代码，然后将这个代码去掉
amd
amd的引用方式是依赖前置，在一个模块中，需要引入外部的模块需要在头部预先引入，代表框架require.js
cmd
amd的引用方式是依赖就近，需要的时候在引入，代表框架sea.js
web-component
微前端
模块化的好处：解决代码以来问题，实现按需加载
组件化
基础组件
各大组件库(antd, element)
自己封装的公共组件
业务组件
和业务紧密结合的组件
npm包管理
lerna
组件化的好处：实现代码复用，和功能变更问题。
自动化(脚本化，使用脚本实现需要手动操作的工作)
webpack、gulp、gurnt这一类构建工具
babel
ast
Source Map
按需加载
loader
plugin
压缩代码
发布流程，CI/CD(持续集成持续测试持续部署)
husky代码预提交校验
lint-staged构建前端工作流
线上版本快速回退
自动化好处：解决开发环境和生产环境差异问题，减少重复的工作。
规范化
微观代码质量(可以通过自动化实现持续集成)
eslint规范代码质量，自定义lint
stylelint规范css质量
使用commit-message规范git commit提交信息
git branch管理规范
使用prettier进行代码格式化，保证团队风格统一
引入TS，进行静态代码校验
使用jest和cypress，进行自动化测试
宏观代码质量
code review
保证代码健壮性，可拓展性，维护性
规范化的好处：保证代码的健壮性，统一团队的代码风格
可视化
数据监控，产品数据可视化
异常数据监控
错误日志
错误闸值报警，接入钉钉/微信机器人
sentry
用户行为监控
前端声明式数据埋点
无痕埋点技术
性能监控
lighthouse
可视化搭建
智能生成h5页面
智能生成后台管理系统页面
可视化的好处：实现线上报错监控，减少线上代码错误
How怎么做前端工程化？