import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "./api";
import { TProductFaqsRequestParamsOptional } from "../../@type/product_faqs";
import queryString from 'query-string'

export const useGetProductsShopifyApi = (params: TProductFaqsRequestParamsOptional) => {
  const { getProductsShopifyApi } = useApi();
    const searchParams = `?${queryString.stringify(params, { skipEmptyString: true, arrayFormat: 'bracket'})}`

  return useQuery({
    queryKey: ['GetProductsShopifyApi', searchParams],
    queryFn: () => getProductsShopifyApi(searchParams),
  });
};

export const useGetProductFaqsApi = () => {
  const { getProductFaqsApi } = useApi();

  return useQuery({
    queryKey: ['GetProductFaqsApi'],
    queryFn: () => getProductFaqsApi(),
  });
};

export const useSearchProductsShopifyApi = (params: TProductFaqsRequestParamsOptional) => {
  
  const { searchProductShopifyApi } = useApi();
  const searchParams = `?${queryString.stringify(params, { skipEmptyString: true, arrayFormat: 'bracket'})}`

  return useQuery({
    queryKey: ['SearchProductShopifyApi', searchParams],
    queryFn: () => searchProductShopifyApi(searchParams),
  });
};

export function useCreateProductsApi() {
  const { mutateCreateProductsApi } = useApi()

  return useMutation({
    mutationFn: mutateCreateProductsApi
  })
}

export function useUpdateProductFaqsApi() {
  const { mutateUpdateProductFaqsApi } = useApi()

  return useMutation({
    mutationFn: mutateUpdateProductFaqsApi
  })
}

export function useDeleteProductFaqsApi() {
  const { mutateDeleteProductFaqsApi } = useApi()

  return useMutation({
    mutationFn: mutateDeleteProductFaqsApi
  })
}

export function useDeleteProductFaqRelationship() {
  const { mutateDeleteProductFaqRelationshipsApi } = useApi()

  return useMutation({
    mutationFn: mutateDeleteProductFaqRelationshipsApi
  })
}