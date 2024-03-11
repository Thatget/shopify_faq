import { useMutation, useQuery } from "@tanstack/react-query"
import { useApi } from "./api"

export const useGetFaqMorePagesApi = () => {
  const { getFaqMorePagesApi } = useApi()

  return useQuery({
    queryKey: ['GetFaqMorePagesApi'],
    queryFn: () => getFaqMorePagesApi(),
  },)
}

export function useUpdateFaqsMorePageApi() {
  const { updateFaqMorePagesApi } = useApi()

  return useMutation({
    mutationFn: updateFaqMorePagesApi
  })
}

export function useDeleteFaqMorePageApi() {
  const { deleteFaqMorePagesApi } = useApi()

  return useMutation({
    mutationFn: deleteFaqMorePagesApi
  })
}
