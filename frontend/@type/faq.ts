export type FaqsApi = Faq[]

export type Faq = {
  category_identify?: string
  content?: string
  createdAt?: string
  feature_faq?: boolean
  id?: number
  identify?: string
  is_visible?: boolean
  locale?: string
  position?: number
  title?: string
  updatedAt?: string
  user_id?: number
  category_name?: string
  isDisable?: boolean
}

export type FaqsIdString = {
  category_identify?: string
  content?: string
  createdAt?: string
  feature_faq?: boolean
  id?: string
  identify?: string
  is_visible?: boolean
  locale?: string
  position?: number
  title?: string
  updatedAt?: string
  user_id?: number
  category_name?: string
  isDisable?: boolean
}