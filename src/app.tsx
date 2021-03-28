export { request } from '@/services';

export async function getInitialState() {
  return {
    auth: {
      page1: true,
      page2: false,
    },
  };
}

export function onRouteChange() {
  // 设置路由变化时当前页面滚动条为0
  document.documentElement.scrollTop = 0;
}

export const layout = () => {
  return {
    logout() {
      console.log('退出');
    },
  };
};
