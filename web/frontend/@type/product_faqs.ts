export type ProductFaqs = {
  category_identify: string
  createdAt?: string
  faq_id: number
  faq_identify: string
  id?: number
  product_id?: number
  updatedAt?: string
  user_id?: number
}

export interface IProductFaqsRequestParams {
  limit: string,
  page_info?: string,
  title?: string,
    cursor?: string
  }

export type ProductSelected = {
  id: string | number;
  url?: string;
  name: string;
};

export type ProductSelectedString = {
  id: string;
  url?: string;
  name: string;
};

export type ProductUpdate = {
  product_id: number;
  product_image?: string;
  product_title: string;
};

export type TProductFaqsRequestParamsOptional = Partial<IProductFaqsRequestParams>;

export type ProductFaqsUpdateAPI = {
  category_identify: string
  faq_id: number
  faq_identify: string
  product_id?: number
}