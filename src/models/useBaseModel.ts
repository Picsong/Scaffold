import { useReducer, useCallback } from 'react';
import type { IReducerMethod, IState } from '@/types/modules/base';
import { Types } from '@/types/modules/base';
import { getBaseData1 } from '@/services/modules/test';

const Reducer: IReducerMethod = (state, action) => {
  switch (action.type) {
    case Types.UpdateBase1:
      return { ...state, base1: action.payload };
    case Types.UpdateBase2:
      return { ...state, base2: action.payload };
    case Types.UpdateAll:
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
};

const initState: IState = {
  base1: [],
  base2: [],
};
export default function useBaseModel() {
  const [state, dispatch] = useReducer(Reducer, initState);

  // 发起请求更新base1数据
  const getBaseDataFetch = useCallback(async () => {
    try {
      const result = await getBaseData1<Pick<IState, 'base1'>>();
      dispatch({
        type: Types.UpdateBase1,
        payload: result.data.base1,
      });
    } catch (error) {
      console.log('页面捕获错误', error);
    }
  }, []);

  return {
    state,
    dispatch,
    getBaseDataFetch,
  };
}
