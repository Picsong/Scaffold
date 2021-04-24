import { request } from 'umi';
import type { IRequestMethod } from '@/types';

export const getBanners: IRequestMethod = (options: any) =>
  request('/banners', {
    method: 'get',
    ...options,
  });

export const addBanner: IRequestMethod = (options: any) =>
  request('/banners', {
    method: 'post',
    ...options,
  });

export const updateBanner: IRequestMethod = (options: any) =>
  request(`/banners/${options.id}`, {
    method: 'patch',
    ...options,
  });

export const delBanner: IRequestMethod = (options: any) =>
  request(`/banners/${options.id}`, {
    method: 'delete',
    ...options,
  });
