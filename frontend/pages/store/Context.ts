import { Dispatch, createContext } from 'react';
import { StoreAction, StoreState } from './type';
import { OptionSelect } from './AppProvider';

interface IAppContext {
  state: StoreState;
  enableThemeExtension: () => void
  defaultLocale: string
  dispatch: Dispatch<StoreAction>;
  shopLocalesOption: OptionSelect[]
  convertLanguage: (value: string) => void
  isFreePlan: boolean
  currentLevelPlan?: number
  // setIsShowMessageGuide: (value: boolean) => void
  // isShowMessageGuide: boolean
}

export const AppContext = createContext<IAppContext | null>(null);
