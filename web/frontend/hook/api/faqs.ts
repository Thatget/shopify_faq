import { useMutation, useQuery } from "@tanstack/react-query"
import { useApi } from "./api"
import { Params } from "react-router-dom"

export const useGetFaqsByLocaleApi = (locale: string) => {
  const { getFaqsByLocaleApi } = useApi()

  return useQuery({
    queryKey: ['GetFaqsByLocaleApi'],
    queryFn: () => getFaqsByLocaleApi(locale),
  },)
}

export const useGetAllFaqsApi = () => {
  const { getAllFaqsApi } = useApi()

  return useQuery({
    queryKey: ['GetAllFaqsApi'],
    queryFn: () => getAllFaqsApi(),
  },)
}

export function useUpdateFaqApi() {
  const { mutateUpdateFaq } = useApi()

  return useMutation({
    mutationFn: mutateUpdateFaq
  })
}

export function useCreateFaqApi() {
  const { mutateCreateFaq } = useApi()

  return useMutation({
    mutationFn: mutateCreateFaq
  })
}

export function useDeleteFaqApi() {
  const { mutateDeleteFaq } = useApi()

  return useMutation({
    mutationFn: mutateDeleteFaq
  })
}

export const useGetFaqByIdApi = (id: Params<string>) => {
  const { getFaqByIdApi } = useApi()
  let param = `${id.id}`

  return useQuery({
    queryKey: ['GetFaqByIdApi'],
    queryFn: () => getFaqByIdApi(param),
  },)
}
