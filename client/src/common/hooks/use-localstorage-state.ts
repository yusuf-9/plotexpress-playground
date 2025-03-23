import { useState } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T) {
  // Get initial value from localStorage if it exists, otherwise use provided initialValue
  const [state, setStateInternal] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  // Wrapper around setState that also updates localStorage
  const setState = (value: T | ((prevState: T) => T)) => {
    setStateInternal(prevState => {
      const nextState = value instanceof Function ? value(prevState) : value;
      localStorage.setItem(key, JSON.stringify(nextState));
      return nextState;
    });
  };

  return [state, setState] as const;
}