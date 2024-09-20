import { useQuery } from "@tanstack/react-query";
import { getMoleculeByName } from "../async/getMoleculeByName";
import { SelectedMolecule } from "@state";

export function useGetMoleculeByName(
  text: SelectedMolecule["text"],
  by: SelectedMolecule["by"]
) {
  return useQuery({
    queryKey: ["molecule", by, text],
    queryFn: () => {
      return getMoleculeByName(text, by);
    },
    enabled: !!text,
  });
}
