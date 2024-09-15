import { useQuery } from "@tanstack/react-query";
import { getMoleculeByName } from "../async/getMoleculeByName";
import { CompoundNameOrId } from "../types";

export function useGetMoleculeByName(
  text: CompoundNameOrId["text"],
  by: CompoundNameOrId["by"]
) {
  return useQuery({
    queryKey: ["molecule", by, text],
    queryFn: () => {
      return getMoleculeByName(text, by);
    },
    enabled: !!text,
  });
}
