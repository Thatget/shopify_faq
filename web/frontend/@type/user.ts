import { CategoryApi } from "./category"
import { FaqsApi } from "./faq"
import { FaqMorePageUpdateApi } from "./faq_more_page"
import { FaqsMorePageSetting } from "./faq_more_page_setting"
import { PlanApi } from "./plans"
import { ProductApi } from "./product"
import { Ratting } from "./ratting"
import { Setting } from "./setting"

export type UserApi = {
  id: string
  email: string
  phone: string
  shopLocales: string
  shopify_domain: string
  store_name: string
}

export type UserAllDataApi = {
  data: {
    allCategory: CategoryApi
    allFaq: FaqsApi
    category: CategoryApi
    faq: FaqsApi
    faqMorePage: FaqMorePageUpdateApi[]
    faqMorePageSetting: FaqsMorePageSetting[]
    plan: PlanApi
    product: ProductApi
    ratting: Ratting
    setting: Setting
    user: UserApi
  }
}

export type ShopLocales = {
  locale: string
  primary: boolean
  published: boolean
  language?: string
}