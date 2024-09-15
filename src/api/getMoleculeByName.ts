import { readMolFile } from "@utils";
import { compoundByNameOrIdUrl } from ".";

export async function getMoleculeByName(text: string, by: "name" | "cid") {
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
