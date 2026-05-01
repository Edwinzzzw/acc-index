import { useEffect, useState } from 'react';

/**
 * 标准 debounce hook：value 变化后 delay 毫秒才更新返回值。
 * 用于搜索框：避免每次按键都重算 fuse 结果。
 */
export function useDebounced<T>(value: T, delay = 150): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
