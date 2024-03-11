import { ActionTypes, StoreAction, type StoreState } from './type';

export const reducer = (
  state: StoreState,
  action: StoreAction
) => {
  const { type, payload } = action
  switch (type) {
    case ActionTypes.SET_USER:
      state.user = payload
      break;
    case ActionTypes.SET_PLAN:
      state.plan = payload
      break;
    case ActionTypes.SET_SETTING:
      state.settings = payload
      break;
    case ActionTypes.SET_FAQS:
      state.faqs = payload
      break;
    case ActionTypes.SET_CATEGORIES:
      state.categories = payload
      break;
    case ActionTypes.SET_ALL_FAQS:
      state.all_faqs = payload
      break;
    case ActionTypes.SET_ALL_CATEGORIES:
      state.all_categories = payload
      break;  
    case ActionTypes.SET_PRODUCTS:
      state.all_product = payload
      break;
    case ActionTypes.SET_PRODUCT_FAQS:
      state.faq_product = payload
      break;  
    case ActionTypes.SET_FAQ_MORE_PAGE:
      state.faq_more_page = payload
      break;
    case ActionTypes.SET_FAQ_MORE_PAGE_SETTING:
      state.faq_more_page_setting = payload
      break;
    case ActionTypes.SET_RATTING:
      state.rating_data = payload
      break;
    case ActionTypes.SET_TEMPLATE_SETTING:
      state.template_setting = payload
      break;  
    case ActionTypes.SET_AUTH:
      state.auth = payload
      break;
    default:
      throw Error('Unknown action: ' + type);
  }
}
