import { request } from 'umi';
import type { IRequestMethod } from '@/types';

export const getBaseData1: IRequestMethod = (options: any) =>
  request('/base1', {
    method: 'get',
    ...options,
  });

export const uploadFile: IRequestMethod = (options: any) =>
  request('/upload', {
    method: 'post',
    ...options,
  });


