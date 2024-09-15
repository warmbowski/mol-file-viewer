import { useQuery } from "@tanstack/react-query";
import { getMolecule } from "../getMolecule";

export function useGetMolecule(CSID: string) {
  return useQuery({
    queryKey: ["molecule", CSID],
    queryFn: () => getMolecule(CSID),
    enabled: !!CSID && CSID !== "custom",
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
