import { CompoundNameOrId, ConformerList } from "../types";
import { compoundByNameOrIdUrl } from "../pubchemUrls";

export async function getConformerList(
  text: CompoundNameOrId["text"],
  by: CompoundNameOrId["by"]
) {
  const resp = await fetch(
    compoundByNameOrIdUrl({
      text,
      by,
      output: "json",
      operation: "conformers",
    })
  );
  return (await resp.json()) as ConformerList;
}
