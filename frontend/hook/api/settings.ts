import { useMutation, useQuery } from "@tanstack/react-query"
import { useApi } from "./api"

export const useGetSettingsApi = () => {
  const { getSettingsApi } = useApi()

  return useQuery({
    queryKey: ['GetSettingsApi'],
    queryFn: () => getSettingsApi(),
  },)
}

export function useUpdateSettingsApi() {
  const { mutateUpdateSettings } = useApi()

  return useMutation({
    mutationFn: mutateUpdateSettings
  })
}

export function useSyncStoreLanguageApi() {
  const { mutateSyncStoreLanguageApi } = useApi()

  return useMutation({
    mutationFn: mutateSyncStoreLanguageApi
  })
}

export function useCreateSettingApi() {
  const { mutateCreateSetting } = useApi()

  return useMutation({
    mutationFn: mutateCreateSetting
  })
}
