import { readMolFile } from "@utils";
import { compoundByNameOrIdUrl } from "../pubchemUrls";
import { CompoundNameOrId } from "../types";

export async function getMoleculeByName(
  text: CompoundNameOrId["text"],
  by: CompoundNameOrId["by"]
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
