import { readMolFile } from "@utils";
import { compoundByNameOrIdUrl } from "../pubchemUrls";
import { SelectedMolecule } from "@state";

export async function getMoleculeByName(
  text: SelectedMolecule["text"],
  by: SelectedMolecule["by"]
) {
  const resp = await fetch(
    compoundByNameOrIdUrl({
      text,
      by,
      output: "sdf",
    })
  );
  const molFile = await resp.text();
  return readMolFile(molFile);
}
