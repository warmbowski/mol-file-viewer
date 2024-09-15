import { useQuery } from "@tanstack/react-query";
import { getMoleculeByName } from "../getMoleculeByName";
import { MOLECULE_OPTIONS } from "@constants";
import { getMolecule } from "../getMolecule";

export function useGetMoleculeByName(text: string, by: "name" | "cid") {
  return useQuery({
    queryKey: ["molecule", by, text],
    queryFn: () => {
      // temporary compatiblity fix until settings are changed
      if (Object.values(MOLECULE_OPTIONS).includes(text)) {
        return getMolecule(text);
      }
      return getMoleculeByName(text, by);
    },
    enabled: !!text,
  });
}
