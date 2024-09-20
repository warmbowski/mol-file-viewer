import { useQuery } from "@tanstack/react-query";
import { getConformerList } from "../async/getConformerList";
import { getConformerMolecule } from "../async/getConformerMolecule";
import { UPLOAD_MOLECULE_PLACEHOLDER } from "@constants";
import { SelectedMolecule } from "@state";

export function useGetConformerMolecule(
  text: SelectedMolecule["text"],
  by: SelectedMolecule["by"]
) {
  return useQuery({
    queryKey: ["molecule", by, text],
    queryFn: async () => {
      const conformerList = await getConformerList(text, by);
      if (conformerList.InformationList.Information[0].ConformerID.length > 0) {
        const conformerId =
          conformerList.InformationList.Information[0].ConformerID[0];
        return await getConformerMolecule(conformerId);
      } else {
        throw new Error("No conformers found");
      }
    },
    enabled: !!text && text !== UPLOAD_MOLECULE_PLACEHOLDER,
  });
}
