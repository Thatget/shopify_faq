import { useCallback, useEffect, useMemo, useState } from "react";
import { AppContext } from "./Context";
import { useCrisp } from "../../hook/useCrisp";
import { useGetAllDataApi } from "../../hook/api/user";
import {
  setAllCategories,
  setAllFaqs,
  setAuth,
  setCategories,
  setFaqMorePageSetting,
  setFaqs,
  setPlan,
  setProduct,
  setRatting,
  setFaqMorePage,
  setSetting,
  setTemplateSetting,
  setUser,
} from "./actions";
import { useImmerReducer } from "use-immer";
import { reducer } from "./reducer";
import { initialState } from "./data";
import { StoreState } from "./type";
import { ShopLocales } from "../../@type/user";
import { useCreateCategoryApi } from "../../hook/api/category";
import { isEmpty } from "lodash-es";
import { useCreatePlanApi } from "../../hook/api/plan";
import { templates } from './data'
import { useCreateSettingApi } from "../../hook/api/settings";
import { useCreateTemplateSettingApi } from "../../hook/api/template_setting";
import { useCreateFaqsMorePageSettingApi } from "../../hook/api/faqs_more_page_setting";

export type OptionSelect = {
  label: string;
  value: string;
};

export interface ContextProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [shopLocalesOption, setShopLocalesOption] = useState<OptionSelect[]>(
    []
  );
  const { initialize } = useCrisp();
  const { data, isSuccess } = useGetAllDataApi("default");
  const [isFreePlan, setIsFreePlan] = useState<boolean>(true);
  const listPlanFree: string[] = ["Free", "Free extra", "Free_01"];
  const [currentLevelPlan, setCurrentLevelPlan] = useState<number>(0);
  const { mutate: mutateCreateCategory } = useCreateCategoryApi()
  const { mutate: mutateCreatePlan } = useCreatePlanApi()
  const { mutate: mutateCreateSetting } = useCreateSettingApi()
  const { mutate: mutateCreateTemplateSetting } = useCreateTemplateSettingApi()
  const { mutate: mutateCreateFaqsMorePageSetting } = useCreateFaqsMorePageSettingApi()
  
  const [state, dispatch] = useImmerReducer(
    reducer,
    initialState,
    (initData: StoreState) => {
      return initData;
    }
  );
  
  useEffect(() => {
    if(state.plan && state.plan.plan){
      setIsFreePlan(listPlanFree.includes(state.plan.plan))
      let level: number
      if(state.plan.plan === 'Pro') {
        level = 2
      } else if(state.plan.plan === 'Ultimate') {
        level = 3
      } else {
        level = 1
      }
      setCurrentLevelPlan(level)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.plan, state.plan.plan])

  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("accessToken");

  useEffect(() => {
    if (accessToken) {
      dispatch(setAuth({ accessToken: accessToken }));
    }
  }, [accessToken, dispatch]);

  const embeddedAppId =
    process.env.EMBEDDED_APP_ID || "b70c1465-6820-4911-8d5d-2299efd66134";

  const enableThemeExtension = () => {
    window.open(
      `https://shoptestdungpham.myshopify.com/admin/themes/current/editor?context=apps&template=index&activateAppId=${embeddedAppId}/app-embed`
    );
  };

  const defaultLocale = useMemo(() => {
    if (state.user.shopLocales) {
      return JSON.parse(state.user.shopLocales).shopLocales.filter(
        (item: any) => item.primary === true
      )[0].locale;
    }
  }, [state.user.shopLocales]);

  const convertLanguage = useCallback((locale: string) => {
    return new Intl.DisplayNames([locale], { type: "language" }).of(locale);
  }, []);

  const listShopLocale: ShopLocales[] = useMemo(() => {
    if (state.user.shopLocales) {
      return JSON.parse(state.user.shopLocales).shopLocales;
    }
  }, [state.user.shopLocales]);

  useEffect(() => {
    if (listShopLocale && listShopLocale.length > 0) {
      let dataInit: OptionSelect[] = [];
      listShopLocale.forEach((item) => {
        dataInit.push({
          label: `${convertLanguage(item.locale)} (${item.locale}) ${
            item.locale === defaultLocale ? "- Default" : ""
          }`,
          value: item.locale,
        });
      });
      setShopLocalesOption(dataInit);
    }
  }, [convertLanguage, defaultLocale, listShopLocale]);

  useEffect(() => {
    initialize({
      id: state.user.id,
      email: state.user.email,
      name: state.user.store_name,
      shopDomain: state.user.shopify_domain,
    });
  }, [
    initialize,
    state.user.email,
    state.user.id,
    state.user.shopify_domain,
    state.user.store_name,
  ]);

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setUser(data.data.user));
      dispatch(setFaqMorePage(data.data.faqMorePage));

      if(!isEmpty(data.data.faqMorePageSetting)) {
        dispatch(setFaqMorePageSetting(data.data.faqMorePageSetting));
      } else {
        createFaqMorePageSetting()
      }

      if(!isEmpty(data.data.plan)) {
        dispatch(setPlan(data.data.plan));
      } else {
        createPlan()
      }

      dispatch(setProduct(data.data.product));
      dispatch(setRatting(data.data.ratting));

      if(!isEmpty(data.data.setting)) {
        dispatch(setSetting(data.data.setting));
      } else {
        createSettings()
      }

      dispatch(setAllFaqs(data.data.allFaq));

      if (!isEmpty(data.data.allCategory)) {
        dispatch(setCategories(data.data.category));
        dispatch(setAllCategories(data.data.allCategory));
      } else {
        createFirstCategory();
      }

      dispatch(setFaqs(data.data.faq));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dispatch, isSuccess]);


  const createFaqMorePageSetting = () => {
    const dataCreate = {
      home_page_visible: false,
      cms_page_visible : false,
      cart_page_visible : false, 
      collection_page_visible : false,
      product_page_visible : false,
      active_feature: false,
      active_template: true,
    }
    mutateCreateFaqsMorePageSetting(dataCreate, {
      onSuccess: (data) => {
        dispatch(setFaqMorePageSetting(data))
      }
    })
  }
  const createPlan = () => {
    const dataCreate = {
      plan: 'Free'
    }
    mutateCreatePlan(dataCreate, {
      onSuccess: (data) => {
        dispatch(setPlan(data));
      }
    })
  }

  const createSettings = () => {
    mutateCreateSetting(templates.setting, {
      onSuccess: (data) => {
        dispatch(setSetting(data));
        createTemplateSetting(data.id || 0)
      }
    })
  }

  const createTemplateSetting = async function(settingDataId: number) {
    let dataCreate = templates.template_2
    dataCreate.setting_id = settingDataId.toString()
    mutateCreateTemplateSetting(dataCreate, {
      onSuccess: (data) => {
        dispatch(setTemplateSetting(data))
      }
    })
  }

  const createFirstCategory = () => {
    const dataCreate = {
      locale: 'default',
      identify: "Uncategorized1",
      title: "Uncategorized",
      description: "FAQs Uncategorized",
      is_visible: true,
      feature_category: false,
    };
    mutateCreateCategory(dataCreate, {
      onSuccess: (data) => {
        dispatch(setCategories(data));
        dispatch(setAllCategories(data));
      }
    })
  };

  return (
    <AppContext.Provider
      value={{
        enableThemeExtension,
        state,
        defaultLocale,
        dispatch,
        shopLocalesOption,
        convertLanguage,
        isFreePlan,
        currentLevelPlan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
