import { request } from 'umi';
import type { IRequestMethod } from '@/types';

export const getBaseData1: IRequestMethod = (options: any) =>
  request('/base1', {
    method: 'get',
    ...options,
  });

export const getBaseData2: IRequestMethod = (options: any) =>
  request('/base2', {
    method: 'get',
    ...options,
  });
export const getBaseAuth: IRequestMethod = (options: any) =>
  request('/auth', {
    method: 'get',
    ...options,
  });
