import { useQuery } from "@tanstack/react-query"
import { useApi } from "./api"

export const useGetWidgetsApi = () => {
  const { getWidgetsApi } = useApi()

  return useQuery({
    queryKey: ['GetWidgetsApi'],
    queryFn: () => getWidgetsApi(),
  },)
}