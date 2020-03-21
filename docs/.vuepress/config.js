module.exports = {
    title: 'melodyPyw blog',
    description: 'melodyPyw的个人网站',
    head: [ // 注入到当前页面的 HTML <head> 中的标签
      ['link', { rel: 'icon', href: './public/logo.png' }], // 增加一个自定义的 favicon(网页标签的图标)
    ],
    base: '/', // 这是部署到github相关的配置
    markdown: {
      lineNumbers: false // 代码块显示行号
    },
    themeConfig: {
        nav:[ // 导航栏配置
            {text: 'js基础', link: '/js-basics/' },
            {text: '算法', link: '/leet-code/'},
            {text: '前端框架', link: '/web-frame/'},
            {text: '工程化', link: '/web-project/'},
            {text: 'TypeScript', link: '/ts-study/'},
        ],
      sidebar: 'auto', // 侧边栏配置
      sidebarDepth: 2, // 侧边栏显示2级
    }
};