import { compoundByNameOrIdUrl, ConformerList } from ".";

export async function getConformerList(text: string, by: "name" | "cid") {
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
