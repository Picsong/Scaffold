import type { ErrorShowType } from 'umi';
import type {
  RequestResponse,
  RequestOptionsInit,
  RequestOptionsWithoutResponse,
  RequestOptionsWithResponse,
} from 'umi-request';

export interface IRequestOptionsInit extends RequestOptionsInit {
  skipErrorHandler?: boolean;
}

export type IRequestOptionsWithoutResponse = RequestOptionsWithoutResponse & {
  skipErrorHandler?: boolean;
};

export type IRequestOptionsWithResponse = RequestOptionsWithResponse & {
  skipErrorHandler?: boolean;
};

export interface IRequestMethod<R = false> {
  <T = any>(options: IRequestOptionsWithResponse): Promise<RequestResponse<ErrorInfoStructure<T>>>;

  <T = any>(options: IRequestOptionsWithoutResponse): Promise<ErrorInfoStructure<T>>;

  <T = any>(options?: IRequestOptionsInit): R extends true
    ? Promise<RequestResponse<ErrorInfoStructure<T>>>
    : Promise<ErrorInfoStructure<T>>;
}

export interface ErrorInfoStructure<T = any> {
  success?: boolean;
  data: T;
  errorCode?: string;
  errorMessage?: string;
  showType?: ErrorShowType;
  traceId?: string;
  host?: string;

  [key: string]: any;
}

export type ActionMap<M extends Record<string, any>> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};
