import { useMutation, useQuery } from "@tanstack/react-query"
import { Params } from "react-router-dom"
import { useApi } from "./api"

export const useGetCategoryByIdApi = (id: Params<string>) => {
  const { getCategoryByIdApi } = useApi()
  let param = `${id.id}`

  return useQuery({
    queryKey: ['GetCategoryByIdApi'],
    queryFn: () => getCategoryByIdApi(param),
  },)
}

export const useGetAllCategoriesApi = () => {
  const { getAllCategoriesApi } = useApi()

  return useQuery({
    queryKey: ['GetAllCategoriesApi'],
    queryFn: () => getAllCategoriesApi(),
  },)
}

export function useUpdateCategoryApi() {
  const { mutateUpdateCategory } = useApi()

  return useMutation({
    mutationFn: mutateUpdateCategory
  })
}

export function useCreateCategoryApi() {
  const { mutateCreateCategory } = useApi()

  return useMutation({
    mutationFn: mutateCreateCategory
  })
}

export function useDeleteCategoryApi() {
  const { mutateDeleteCategory } = useApi()

  return useMutation({
    mutationFn: mutateDeleteCategory
  })
}
