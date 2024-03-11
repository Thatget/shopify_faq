export type ProductApi = {
  createdAt?: string
  product_id: number
  product_image?: string
  product_title: string
  updatedAt?: string
  user_id: number
  id?: number 
}[]

export type ProductIdStringApi = {
  product_id: number
  product_image: string
  product_title: string
  user_id: number
  id: string 
}[]

export type ProductsShopifyApi = {
  count: {
    count?: number
  }
  paginate?: {
    next?: string
    previous?: string
  }
  products: {
    products?: ProductShopify[]
  }
}

export type ProductShopify = {
  id: number
  images: {
    admin_graphql_api_id: string
    alt: string
    created_at: string
    height: number
    id: number
    position: number
    product_id: number
    src: string
    updated_at: string
    variant_ids?: string[]
    width: number
  }[]
  title: string
}

export type ProductShopifyIdString = {
  id: string
  images: {
    admin_graphql_api_id: string
    alt: string
    created_at: string
    height: number
    id: number
    position: number
    product_id: number
    src: string
    updated_at: string
    variant_ids?: string[]
    width: number
  }[]
  title: string
}

export type ProductsSearchApi = {
  paginate?: {
    next?: string
    previous?: string
  }
  edges: {
    cursor: string
    node: {
      handle : string
      id :  string
      images : {
        edges: { 
          node: {
            url: string
          }
        }[]
      }
      title: string
    }
  }[]
}
