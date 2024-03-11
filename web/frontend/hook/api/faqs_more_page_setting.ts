import { useMutation } from "@tanstack/react-query"
import { useApi } from "./api"

export function useUpdateFaqsMorePageSettingApi() {
  const { mutateUpdateFaqsMorePageSettingApi } = useApi()

  return useMutation({
    mutationFn: mutateUpdateFaqsMorePageSettingApi
  })
}

export function useCreateFaqsMorePageSettingApi() {
  const { mutateCreateFaqsMorePageSettingApi } = useApi()

  return useMutation({
    mutationFn: mutateCreateFaqsMorePageSettingApi
  })
}
