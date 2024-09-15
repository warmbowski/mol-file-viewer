import { useQuery } from "@tanstack/react-query";
import { searchCompounds } from "../searchCompounds";

export function useSearchCompounds(search: string) {
  return useQuery({
    queryKey: ["compound", "search", search],
    queryFn: () => searchCompounds(search),
    enabled: !!search,
  });
}
