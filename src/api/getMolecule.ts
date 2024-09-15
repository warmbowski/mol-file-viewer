import { readMolFile } from "@utils";

export async function getMolecule(CSID: string) {
  const resp = await fetch("molecules/" + CSID + ".mol");
  const molFile = await resp.text();
  return readMolFile(molFile);
}
