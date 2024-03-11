import { useCallback } from 'react';

export const useSessionStorage = () => {
  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

  const getItem = useCallback(
    (key: string): string => {
      return isBrowser ? window.sessionStorage[key] : '';
    },
    [isBrowser],
  );

  const setItem = useCallback(
    (key: string, value: string): boolean => {
      if (isBrowser) {
        window.sessionStorage.setItem(key, value);
        return true;
      }

      return false;
    },
    [isBrowser],
  );

  const removeItem = useCallback((key: string): void => {
    window.sessionStorage.removeItem(key);
  }, []);

  return {
    getItem,
    setItem,
    removeItem,
  };
};
