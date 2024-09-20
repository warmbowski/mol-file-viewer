import { ConformerList, PUGRESTError } from "../types";
import { compoundByNameOrIdUrl } from "../pubchemUrls";
import { SelectedMolecule } from "@state";

export async function getConformerList(
  text: SelectedMolecule["text"],
  by: SelectedMolecule["by"]
) {
  const resp = await fetch(
    compoundByNameOrIdUrl({
      text,
      by,
      output: "json",
      operation: "conformers",
    })
  );
  if (resp.ok === false) {
    const errorBody = (await resp.json()) as PUGRESTError;
    console.error(errorBody);
    throw new Error(errorBody.Fault.Message);
  }
  return (await resp.json()) as ConformerList;
}
