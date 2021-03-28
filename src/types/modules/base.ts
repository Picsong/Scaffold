import type { ActionMap } from '..';

export interface IBaseType1 {
  top: string;
  bottom: string;
}

export interface IBaseType2 {
  left: string;
  right: string;
}

export enum Types {
  UpdateBase1 = 'UPDATE_BASE1',
  UpdateBase2 = 'UPDATE_BASE2',
  UpdateAll = 'UPDATE_ALL',
}

export interface IState {
  base1: IBaseType1[];
  base2: IBaseType2[];
}

type MapAction = {
  [Types.UpdateBase1]: IBaseType1[];
  [Types.UpdateBase2]: IBaseType2[];
  [Types.UpdateAll]: IState;
};

export type IAction = ActionMap<MapAction>[Types];

export interface IReducerMethod {
  (state: IState, action: IAction): IState;
}
