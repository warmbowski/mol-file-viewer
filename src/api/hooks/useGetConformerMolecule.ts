import { useQuery } from "@tanstack/react-query";
import { MOLECULE_OPTIONS } from "@constants";
import { getMolecule } from "../getMolecule";
import { getConformerList } from "../getConformerList";
import { getConformerMolecule } from "../getConformerMolecule";

export function useGetConformerMolecule(text: string, by: "name" | "cid") {
  return useQuery({
    queryKey: ["molecule", by, text],
    queryFn: async () => {
      // temporary compatiblity fix until settings are changed
      if (Object.values(MOLECULE_OPTIONS).includes(text)) {
        return await getMolecule(text);
      }

      const conformerList = await getConformerList(text, by);
      if (conformerList.InformationList.Information[0].ConformerID.length > 0) {
        const conformerId =
          conformerList.InformationList.Information[0].ConformerID[0];
        return await getConformerMolecule(conformerId);
      } else {
        throw new Error("No conformers found");
      }
    },
    enabled: !!text,
  });
}
