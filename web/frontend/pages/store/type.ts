import { CategoryApi } from "../../@type/category";
import { FaqsApi } from "../../@type/faq";
import { FaqMorePageUpdateApi } from "../../@type/faq_more_page";
import { FaqsMorePageSetting } from "../../@type/faq_more_page_setting";
import { PlanApi } from "../../@type/plans";
import { ProductApi } from "../../@type/product";
import { ProductFaqs } from "../../@type/product_faqs";
import { Ratting } from "../../@type/ratting";
import { Setting } from "../../@type/setting";
import { TemplateSettingApi } from "../../@type/template_setting";
import { UserApi } from "../../@type/user"
import { FaqMessageSettingsApi, FaqMessages } from "../../@type/widget";

export interface StoreState {
  user: UserApi;
  plan: PlanApi;
  faqs: FaqsApi
  all_faqs: FaqsApi
  categories: CategoryApi
  all_categories: CategoryApi
  all_product?: ProductApi
  faq_product?: ProductFaqs[]
  faq_messages_setting?: FaqMessageSettingsApi[]
  faq_messages?: FaqMessages[]
  faq_more_page?: FaqMorePageUpdateApi[]
  faq_more_page_setting: FaqsMorePageSetting[]
  admin_account: {
    user_name: string
    password: string
  }
  showBannerReturn: boolean
  product_data: ProductApi
  adminIsAuthenticated : boolean
  rating_data: Ratting
  faq_more_page_setting_create: {
    home_page_visible: boolean
    cms_page_visible : boolean
    cart_page_visible : boolean
    collection_page_visible : boolean
    product_page_visible : boolean
    active_feature: boolean
    active_template: boolean
  },
  settings: Setting
  template_setting: TemplateSettingApi
  auth: {
    accessToken: string
  }
}

export type ActionMap<M extends { [index: string]: unknown }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
      type: Key;
    } : {
      type: Key;
      payload: M[Key]
    }
}

export enum ActionTypes {
  SET_USER = 'SET_USER',
  SET_PLAN = 'SET_PLAN',
  SET_SETTING = 'SET_SETTING',
  SET_FAQS = 'SET_FAQS',
  SET_CATEGORIES = 'SET_CATEGORIES',
  SET_PRODUCTS = 'SET_PRODUCTS',
  SET_PRODUCT_FAQS = 'SET_PRODUCT_FAQS',
  SET_FAQ_MORE_PAGE = 'SET_FAQ_MORE_PAGE',
  SET_FAQ_MORE_PAGE_SETTING = 'SET_FAQ_MORE_PAGE_SETTING',
  SET_RATTING = 'SET_RATTING',
  SET_ALL_FAQS = 'SET_ALL_FAQS',
  SET_ALL_CATEGORIES = 'SET_ALL_CATEGORIES',
  SET_AUTH = 'SET_AUTH',
  SET_TEMPLATE_SETTING = 'SET_TEMPLATE_SETTING'
}

export type SettingPayload = {
  [ActionTypes.SET_USER]: StoreState['user'];
  [ActionTypes.SET_PLAN]: StoreState['plan'];
  [ActionTypes.SET_SETTING]: StoreState['settings'];
  [ActionTypes.SET_FAQS]: StoreState['faqs'];
  [ActionTypes.SET_CATEGORIES]: StoreState['categories'];
  [ActionTypes.SET_PRODUCTS]: StoreState['all_product'];
  [ActionTypes.SET_PRODUCT_FAQS]: StoreState['faq_product'];
  [ActionTypes.SET_FAQ_MORE_PAGE]: StoreState['faq_more_page'];
  [ActionTypes.SET_FAQ_MORE_PAGE_SETTING]: StoreState['faq_more_page_setting'];
  [ActionTypes.SET_RATTING]: StoreState['rating_data'];
  [ActionTypes.SET_ALL_FAQS]: StoreState['all_faqs'];
  [ActionTypes.SET_ALL_CATEGORIES]: StoreState['all_categories'];
  [ActionTypes.SET_AUTH]: StoreState['auth'];
  [ActionTypes.SET_TEMPLATE_SETTING]: StoreState['template_setting'];
}

export type StoreAction = ActionMap<SettingPayload>[keyof ActionMap<SettingPayload>]
