import type { RequestConfig } from 'umi';
import { notification } from 'antd';

import { getStorage, Types } from '@/helpers/storage';

export const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export const request: RequestConfig = {
  timeout: 30000,
  prefix: '/api',
  headers: {
    project: '1', // 对应后台项目1，腾云忆想
  },
  requestInterceptors: [
    (url, options) => {
      const token = getStorage(Types.Token);
      const headers = {
        ...options.headers,
        token,
      };
      return {
        url,
        options: {
          ...options,
          headers,
          interceptors: true,
        },
      };
    },
  ],
  responseInterceptors: [
    (response) => {
      console.log('response :>> ', response);
      if (response.status !== 200) {
        notification.error({
          message: codeMessage[response.status] || response.statusText,
          description: `错误URL:${response.url}`,
        });
      }
      // 返回交给下一个拦截器处理
      return response;
    },
    async (response) => {
      const data = await response.clone().json();
      console.log('data :>> ', data);

      // 返回到发送请求的地方，会根据success的值自动走到then回调或者catch回调中，在success为true时返回到页面的数据是解析过的（为上面的data）
      return response;
    },
  ],
};
