import { defineConfig } from 'umi';

const px2rem = require('postcss-pxtorem');

export default defineConfig({
  antd: {},
  cssLoader: {
    localsConvention: 'camelCase', //css类名转为小驼峰
  },
  devServer: {
    port: 2021,
  },
  dynamicImport: {
    loading: '@/components/Loading', //路由加载loading
  },
  extraPostCSSPlugins: [
    px2rem({
      rootValue: 37.5, //这里根据设计稿大小配置,一般是375
      propList: ['*'],
      exclude: /global|components|pages|\/node_modules\/antd\//,
    }),
  ],
  hash: true,
  history: {
    type: 'hash',
  },
  layout: {
    name: 'Picsong',
    locale: false,
    layout: 'side',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  proxy: {
    '/api': {
      target: 'http://192.168.31.159:3030',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  title: '网页标题',
  routes: [
    {
      //移动端页面在这里
      path: '/m',
      component: '@/mobile/index',
      layout: false,
      routes: [
        { path: '/m', exact: true, component: '@/mobile/Home/index' },
        { path: '/m/test', exact: true, component: '@/mobile/Test/index' },
      ],
    },
    {
      //PC网站的在这里
      path: '/pc',
      component: '@/pages/index',
      layout: false,
      routes: [
        { path: '/pc', exact: true, component: '@/pages/Home/index' },
        { path: '/pc/test', exact: true, component: '@/pages/Test/index' },
      ],
    },
    { path: '/404', component: '@/pages/404', layout: false },
    {
      //后台系统的页面
      path: '/',
      component: '@/pages/Admin/Wrap/index',
      flatMenu: true,
      routes: [
        {
          //后台首页
          path: '/',
          exact: true,
          component: '@/pages/Admin/index',
        },
        {
          //后台系统列表页面
          path: '/list',
          name: '列表',
          icon: 'logout',
          component: '@/pages/Admin/Wrap/index',
          routes: [
            {
              path: '/list/page1',
              exact: true,
              component: '@/pages/Admin/ListPage1/index',
              menu: { name: '页面1' },
            },
            {
              path: '/list/page2',
              exact: true,
              component: '@/pages/Admin/ListPage2/index',
              menu: { name: '页面2' },
            },
            {
              path: '/list/page3',
              exact: true,
              hideInMenu: true,
              menuRender: false,
              component: '@/pages/Admin/ListPage3/index',
              menu: { name: '页面3' },
            },
            { component: '@/pages/404' },
          ],
        },
        { component: '@/pages/404' },
      ],
    },
  ],
  fastRefresh: {},
});
