import {ActionTypes, StoreState} from './type'

export const setUser = (payload: StoreState['user']) => ({
  type: ActionTypes.SET_USER as const,
  payload
})

export const setPlan = (payload: StoreState['plan']) => ({
  type: ActionTypes.SET_PLAN as const,
  payload
})

export const setSetting = (payload: StoreState['settings']) => ({
  type: ActionTypes.SET_SETTING as const,
  payload
})

export const setTemplateSetting = (payload: StoreState['template_setting']) => ({
  type: ActionTypes.SET_TEMPLATE_SETTING as const,
  payload
})

export const setFaqs = (payload: StoreState['faqs']) => ({
  type: ActionTypes.SET_FAQS as const,
  payload
})

export const setAllFaqs = (payload: StoreState['all_faqs']) => ({
  type: ActionTypes.SET_ALL_FAQS as const,
  payload
})

export const setCategories = (payload: StoreState['categories']) => ({
  type: ActionTypes.SET_CATEGORIES as const,
  payload
})

export const setAllCategories = (payload: StoreState['all_categories']) => ({
  type: ActionTypes.SET_ALL_CATEGORIES as const,
  payload
})

export const setProduct = (payload: StoreState['all_product']) => ({
  type: ActionTypes.SET_PRODUCTS as const,
  payload
})

export const setProductFaqs = (payload: StoreState['faq_product']) => ({
  type: ActionTypes.SET_PRODUCT_FAQS as const,
  payload
})

export const setFaqMorePage = (payload: StoreState['faq_more_page']) => ({
  type: ActionTypes.SET_FAQ_MORE_PAGE as const,
  payload
})

export const setFaqMorePageSetting = (payload: StoreState['faq_more_page_setting']) => ({
  type: ActionTypes.SET_FAQ_MORE_PAGE_SETTING as const,
  payload
})

export const setRatting = (payload: StoreState['rating_data']) => ({
  type: ActionTypes.SET_RATTING as const,
  payload
})

export const setAuth = (payload: StoreState['auth']) => ({
  type: ActionTypes.SET_AUTH as const,
  payload
})
