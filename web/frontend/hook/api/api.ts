import {useCallback} from 'react'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios';
import { Faq, FaqsApi } from '../../@type/faq';
import { Category, CategoryApi } from '../../@type/category';
import { Setting } from '../../@type/setting';
import { ProductApi, ProductsSearchApi, ProductsShopifyApi } from '../../@type/product';
import { FaqsMorePageSetting } from '../../@type/faq_more_page_setting';
import { ProductFaqs, ProductFaqsUpdateAPI, ProductUpdate } from '../../@type/product_faqs';
import { PlanApi } from '../../@type/plans';
import { TemplateSettingApi } from '../../@type/template_setting';
import { FaqMessageSettingsApi } from '../../@type/widget';
import { FaqMorePageUpdateApi } from '../../@type/faq_more_page';
import { UserAllDataApi, UserApi } from '@/@type/user';

export interface IHttp {
  get<T = any, R = AxiosResponse<T>>(url: string, params?: Record<string, any>): Promise<R>,
  post<T = any, R = AxiosResponse<T>>(url: string, params?: Record<string, any>, options?: Partial<AxiosRequestConfig>): Promise<R>,
  put<T = any, R = AxiosResponse<T>>(url: string, params?: Record<string, any>, options?: Partial<AxiosRequestConfig>): Promise<R>,
  delete<T = any, R = AxiosResponse<T>>(url: string, params?: Record<string, any>): Promise<R>,
  request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R>,
  getClient: () => AxiosInstance
}

export class Http implements IHttp {
  private readonly client: AxiosInstance
  constructor(axios: AxiosStatic) {
    // For fake login from admin user
    this.client = axios.create({
      baseURL: baseURL+"/api",
      headers: {
        'Content-Type': 'application/json',
        "x-access-token": accessToken
      },
      withCredentials: true,
    });
    // how to add header to axios
    // https://stackoverflow.com/questions/45578844/how-to-add-headers-to-axios

  }

  public getClient(): AxiosInstance {
    return this.client
  }

  public get<T = any, R = AxiosResponse<T>>(url: string, params?: Record<string, any>): Promise<R> {

    return this.client.get(url, {
      params: params
    })
  }

  public post<T = any, R = AxiosResponse<T>>(url: string, payload?: Record<string, any>, options?: Partial<AxiosRequestConfig>): Promise<R> {
    return this.client.post(url, payload, options)
  }

  public put<T = any, R = AxiosResponse<T>>(url: string, payload?: Record<string, any>, options?: Partial<AxiosRequestConfig>): Promise<R> {
    return this.client.put(url, payload, options)
  }

  public delete<T = any, R = AxiosResponse<T>>(url: string, payload?: Record<string, any>): Promise<R> {
    return this.client.delete(url, payload)
  }

  request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
    return this.client.request(config)
  }
}

const baseURL = process.env.REACT_APP_BACKEND_URL
var url = window.location.href;
let accessToken = url.slice(url.search('=') + 1, url.search('&'))

const http = axios.create({
  baseURL: baseURL+"/api",
  headers: {
    'Content-Type': 'application/json',
    "x-access-token": accessToken
  },
});

export const useApi = () => {
  const fetcher = useFetch()

  return {
    mutateGetUserApi: async() => {
      return await fetcher<UserApi>('/user', {
        method: 'GET'
      })
    },

    getAllDataUser: async(locale: string) => {
      return await fetcher<UserAllDataApi>(`/data-user?locale=${locale}`, {
        method: 'GET'
      })
    },
    
    //FAQS
    getFaqsByLocaleApi: async(locale: string) => {
      return await fetcher<FaqsApi>(`/faq?locale=${locale}`, {
        method: 'GET'
      })
    },

    getAllFaqsApi: async() => {
      return await fetcher<FaqsApi>(`/faq/all`, {
        method: 'GET'
      })
    },
      
    getFaqByIdApi: async(id: string) => {
      return await fetcher<Faq>(`/faq/${id}`, {
        method: 'GET'
      })
    },

    mutateUpdateFaq: async(faq: Faq) => {
      await fetcher<FaqsApi>(`/faq/${faq.id}`, {
        method: 'PUT',
        body: JSON.stringify(faq)
      })
    },

    mutateCreateFaq: async(faq: Faq) => {
      await fetcher<FaqsApi>(`/faq`, {
        method: 'POST',
        body: JSON.stringify(faq)
      })
    },

    mutateDeleteFaq: async(faq: Faq) => {
      await fetcher<FaqsApi>(`/faq/${faq.id}?identify=${faq.identify}&category_identify=${faq.category_identify}`, {
        method: 'DELETE',
      })
    },

    //CATEGORIES
    getCategoryByIdApi: async(id: string) => {
      return await fetcher<Category>(`/faq-category/${id}`, {
        method: 'GET'
      })
    },

    mutateUpdateCategory: async(category: Category) => {
      await fetcher<CategoryApi>(`/faq-category/${category.id}`, {
        method: 'PUT',
        body: JSON.stringify(category)
      })
    },
    
    mutateCreateCategory: async(category: Category) => {
      console.log(category)
      return await fetcher<CategoryApi>(`/faq-category`, {
        method: 'POST',
        body: JSON.stringify(category)
      })
    },

    getAllCategoriesApi: async() => {
      return await fetcher<CategoryApi>(`/faq-category/all`, {
        method: 'GET'
      })
    },


    mutateDeleteCategory: async(category: Category) => {
      if(category.identify) {
        await fetcher<CategoryApi>(`/faq-category/${category.id}?identify=${category.identify}`, {
          method: 'DELETE',
        })
      }
      else {
        await fetcher<CategoryApi>(`/faq-category/${category.id}`, {
          method: 'DELETE',
        })
      }
    },

    //WIDGET
    getWidgetsApi: async() => {
      return await fetcher<FaqMessageSettingsApi>(`/messages-setting`, {
        method: 'GET'
      })
    },

    //SETTING
    getSettingsApi: async() => {
      return await fetcher<Setting>(`/setting`, {
        method: 'GET'
      })
    },

    mutateUpdateSettings: async(data: any) => {
      return await fetcher<Setting>('/setting', {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    mutateSyncStoreLanguageApi: async() => {
      return await fetcher('/sync-languages', {
        method: 'GET',
      })
    },

    mutateCreateSetting: async(setting: Setting) => {
      return await fetcher<Setting>('/setting', {
        method: 'POST',
        body: JSON.stringify(setting)
      })
    },
    
    //PRODUCT FAQS
    getProductsShopifyApi: async(querySearch: string) => {
      return await fetcher<ProductsShopifyApi>(`/shop/product-list${querySearch}`, {
        method: 'GET'
      })
    },

    searchProductShopifyApi: async(querySearch: string) => {
      if(querySearch.includes('title')){
        return await fetcher<ProductsSearchApi>(`/shop/search-product${querySearch}`, {
          method: 'GET'
        })
      }
      return
    },

    mutateDeleteProductFaqRelationshipsApi: async(product_faq_id: string) => {
      return await fetcher<FaqsMorePageSetting>(`/faq-product/${product_faq_id}`, {
        method: 'DELETE',
      })
    },


    //FAQ MORE PAGE
    getFaqMorePagesApi: async() => {
      return await fetcher<FaqMorePageUpdateApi[]>(`/faq-more-page`, {
        method: 'GET'
      })
    },

    updateFaqMorePagesApi: async(data: FaqMorePageUpdateApi[]) => {
      return await fetcher<FaqMorePageUpdateApi[]>(`/faq-more-page`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    deleteFaqMorePagesApi: async(id: string) => {
      return await fetcher(`/faq-more-page/${id}`, {
        method: 'DELETE',
      })
    },

    //FAQ MORE PAGE SETTING
    mutateUpdateFaqsMorePageSettingApi: async(data: FaqsMorePageSetting) => {
      return await fetcher<FaqsMorePageSetting>(`/faq-more-page-setting/${data.user_id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
    },

    mutateCreateFaqsMorePageSettingApi: async(data: FaqsMorePageSetting) => {
      return await fetcher<FaqsMorePageSetting[]>(`/faq-more-page-setting`, {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    //PRODUCT API
    mutateCreateProductsApi: async(data: ProductUpdate[]) => {
      return await fetcher<ProductApi>('/product', {
        method: 'POST',
        body: JSON.stringify(data)
      })

    },
    getProductsApi: async() => {
      return await fetcher<ProductApi>('/product', {
        method: 'GET'
      })
    },

    //PRODUCT FAQS API
    mutateUpdateProductFaqsApi: async(data: ProductFaqsUpdateAPI[]) => {
      return await fetcher<ProductFaqs[]>('/faq-product', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },
    
    getProductFaqsApi: async() => {
      return await fetcher<ProductFaqs[]>('/faq-product/product', {
        method: 'GET'
      })
    },

    mutateDeleteProductFaqsApi: async(id: string) => {
      return await fetcher<CategoryApi>(`/product/${id}`, {
        method: 'DELETE'
      })
    },

    //PLAN
    mutateCreatePlan: async(data: {plan: string}) => {
      return await fetcher<PlanApi>('/plan', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    },

    //TEMPLATE SETTING
    mutateCreateTemplateSetting: async(template: TemplateSettingApi) => {
      return await fetcher<TemplateSettingApi>('/template_setting', {
        method: 'POST',
        body: JSON.stringify(template)
      })
    },
  }
}

const useFetch = () => {
  // const authenticatedFetch = useAuthenticatedFetch()
  const fetcher = useCallback(async <T>(url: string, requestInit: { method: string, body?: any}) => {
    let response
    switch(requestInit.method){
      case 'GET': 
        response = await http.get<T>(url)
        break;
      case 'POST': 
        response = await http.post<T>(url,
          requestInit.body
        )
        break;
      case 'PUT': 
        response = await http.put<T>(url,
          requestInit.body
        )
        break;
      case 'DELETE': 
        response = await http.delete<T>(url,
          requestInit.body
        )
        break;
      default:
        response = await http.get<T>(url)
    }

    if (!response.data) {
      // let errMessage = ''
      // switch (response.status) {
      //   case 404:
      //     errMessage = 'No data';
      //     break;
      //   case 400:
      //     errMessage = 'Bad request'
      //     break
      // }

      // const errorInfo = response
      
      // if (errorInfo) throw errorInfo.message;
      // throw new Error(errMessage)
    }
    // const responseType = response.headers.get('content-type')

    // if (includes(['application/pdf', 'text/html; charset=UTF-8'], responseType)) {
    //   return (await response.blob()) as T;
    // }
    return (response.data) as T
  }, [])

  return fetcher
}
