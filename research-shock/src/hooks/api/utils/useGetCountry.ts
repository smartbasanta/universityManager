import { utilService } from "@/service/utilService";
import { useQuery } from "@tanstack/react-query";

export function useGetCountry() {
  return useQuery({
    queryKey: ["get-all-country"],
    queryFn: utilService.getAllCountry,
  });
}
