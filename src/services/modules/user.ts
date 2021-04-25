import { request } from 'umi';
import type { IRequestMethod } from '@/types';

export interface IUserLoginReq {
  name: string;
  password: string;
}

export interface IUserLoginRes {
  token: string;
  name: string;
  role: string;
  project: string;
}
// 登录
export const userLogin: IRequestMethod<IUserLoginReq> = (options: any) =>
  request('/users/login', {
    method: 'post',
    ...options,
  });
// 获取用户列表
export const getUsers: IRequestMethod = (options: any) =>
  request('/users', {
    method: 'get',
    ...options,
  });
// 新增用户
export const addUser: IRequestMethod = (options: any) =>
  request('/users', {
    method: 'post',
    ...options,
  });
// 修改用户
export const updateUser: IRequestMethod = (options: any) =>
  request(`/users/${options.data.itemId}`, {
    method: 'patch',
    ...options,
  });
// 删除用户
export const delUser: IRequestMethod = (options: any) =>
  request(`/users/${options.data}`, {
    method: 'delete',
    ...options,
  });
