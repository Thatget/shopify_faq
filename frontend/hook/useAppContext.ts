import { useContext } from 'react';
import { AppContext } from '../pages/store/Context';

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('AppContext must be used inside the AppProvider');
  }

  return context
};
