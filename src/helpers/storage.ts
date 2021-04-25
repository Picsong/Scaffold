export enum Types {
  Token = 'APP_TOKEN',
  IsLogin = 'IS_LOGIN',
  UserName = 'USER_NAME',
  Project = 'PROJECT',
  // NewsDetails = 'NEWS_DETAILS',
}

export type StorageType = 'session' | 'local';

export const getStorage = (key: Types, type?: StorageType) => {
  if (type === 'local') {
    return JSON.parse(window.localStorage.getItem(key) as string);
  }
  return JSON.parse(window.sessionStorage.getItem(key) as string);
};

export const setStorage = (key: Types, value: any, type?: StorageType) => {
  if (type === 'local') {
    return window.localStorage.setItem(key, JSON.stringify(value));
  }
  return window.sessionStorage.setItem(key, JSON.stringify(value));
};

export const removeStorage = (key: Types, type?: StorageType) => {
  if (type === 'local') {
    return window.localStorage.removeItem(key);
  }
  return window.sessionStorage.removeItem(key);
};
