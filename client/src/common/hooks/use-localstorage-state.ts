import { useCallback, useState } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T, skipLocalStorageUpdate = false) {
  // Get initial value from localStorage if it exists, otherwise use provided initialValue
  const [state, setStateInternal] = useState<T>(() => {
    if (skipLocalStorageUpdate) return initialValue;

    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  // Wrapper around setState that also updates localStorage
  const setState = useCallback((value: T | ((prevState: T) => T)) => {
    setStateInternal(prevState => {
      const nextState = value instanceof Function ? value(prevState) : value;
      if (!skipLocalStorageUpdate) {
        localStorage.setItem(key, JSON.stringify(nextState));
      }
      return nextState;
    });
  }, [key, skipLocalStorageUpdate]);

  return [state, setState] as const;
}
