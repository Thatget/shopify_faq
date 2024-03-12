import { useMutation } from "@tanstack/react-query"
import { useApi } from "./api"

export function useCreatePlanApi() {
  const { mutateCreatePlan } = useApi()

  return useMutation({
    mutationFn: mutateCreatePlan
  })
}
