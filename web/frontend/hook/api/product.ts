import { useQuery } from "@tanstack/react-query";
import { useApi } from "./api";

export const useGetProductsApi = () => {
  const { getProductsApi } = useApi();

  return useQuery({
    queryKey: ['GetProductsApi'],
    queryFn: () => getProductsApi(),
  });
};