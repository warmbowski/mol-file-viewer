import { readMolFile } from "../utils/readMolfile";

export async function getMolecule(CSID: string) {
  const resp = await fetch("molecules/" + CSID + ".mol");
  const molFile = await resp.text();
  const molObj = readMolFile(molFile);
  // console.log(molObj);
  return molObj;
}
