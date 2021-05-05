import { useCallback, useDebugValue, useEffect, useState } from 'react';

interface IProps {
  immediate?: boolean;
  second?: number;
  delay?: number;
}
let timer: NodeJS.Timeout | null = null;

const initialValue: IProps = {
  immediate: false,
  second: 60,
  delay: 1000,
};

/**
 * 倒计时hook（常用于发送验证码等）
 * @param {boolean} immediate   是否立即触发--默认false
 * @param {number} second   秒数--默认60
 * @param {number} delay    延迟时间--默认1000
 */
export default function useCountDown({
  immediate = false,
  second = 60,
  delay = 1000,
}: IProps = initialValue) {
  const [count, setCount] = useState(second); // 倒计时计数器
  const [flag, setFlag] = useState(true); // 定时器改变的一个标志
  // 定时器启动函数
  const run = useCallback(() => {
    if (timer) return;
    setFlag(false);

    timer = setInterval(() => {
      // 必须使用回调函数的更新方式更新count值，不然会只更新一次，就停止。
      setCount((c) => {
        if (c == 0) {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          setFlag(true);
          return second; // 恢复为初始值
        }
        return c - 1;
      });
    }, delay);
  }, [delay, second]);

  useEffect(() => {
    // 是否要立即运行
    if (immediate) run();
    return () => {
      // 退出时清除副作用
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, [immediate, run]);

  useDebugValue('倒计时hook');
  return {
    count,
    flag,
    run,
  };
}
