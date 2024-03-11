import { useMutation, useQuery } from '@tanstack/react-query'
import { useApi } from './api'

export function useGetAllDataApi(locale: string) {
  const { getAllDataUser } = useApi();

  return useQuery({
    queryKey: ['getAllDataUser'],
    queryFn: () => getAllDataUser(locale),
    retry: false
  })
}

export function useGetUserApi() {
  const { mutateGetUserApi } = useApi()

  return useMutation({
    mutationFn: mutateGetUserApi
  })
}
