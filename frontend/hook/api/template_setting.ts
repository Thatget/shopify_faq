import { useMutation } from "@tanstack/react-query"
import { useApi } from "./api"

export function useCreateTemplateSettingApi() {
  const { mutateCreateTemplateSetting } = useApi()

  return useMutation({
    mutationFn: mutateCreateTemplateSetting
  })
}