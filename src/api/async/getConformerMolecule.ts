import { readMolFile } from "@utils";
import { conformerUrl } from "../pubchemUrls";

export async function getConformerMolecule(conformerId: string) {
  const resp = await fetch(conformerUrl({ conformerId, output: "sdf" }));
  const molFile = await resp.text();
  return readMolFile(molFile);
}
