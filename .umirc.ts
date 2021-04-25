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
      exclude: /global|components|pages|\/antd\/|braft-editor/,
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
    { path: '/login', component: '@/pages/Login/index', layout: false },
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
      //后台系统的页面
      path: '/admin',
      component: '@/wrappers/LoginWrapper',
      flatMenu: true,
      routes: [
        {
          //后台首页
          path: '/admin',
          exact: true,
          component: '@/pages/Admin/index',
        },
        {
          path: '/admin/user',
          name: '用户管理',
          icon: 'user',
          component: '@/layouts/index',
          routes: [
            {
              path: '/admin/user/account',
              exact: true,
              component: '@/pages/Admin/AccountManagement/index',
              menu: { name: '账号管理' },
              // access: 'page1',
            },
            { component: '@/pages/404' },
          ],
        },
        {
          path: '/admin/list',
          name: '网站管理',
          icon: 'logout',
          component: '@/layouts/index',
          routes: [
            {
              path: '/admin/list/page1',
              exact: true,
              component: '@/pages/Admin/ListPage1/index',
              menu: { name: '轮播图管理' },
              // access: 'page1',
            },
            { component: '@/pages/404' },
          ],
        },
      ],
    },
    { path: '/404', component: '@/pages/404', layout: false },
    {
      //PC网站的在这里
      path: '/',
      component: '@/pages/index',
      layout: false,
      routes: [
        { path: '/', exact: true, component: '@/pages/Home/index' },
        { path: '/test', exact: true, component: '@/pages/Test/index' },
        { redirect: '/404' },
      ],
    },
  ],
  fastRefresh: {},
});
