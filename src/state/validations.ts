import { z } from "zod";

export const selectedMoleculeSchema = z.object({
  text: z.string(),
  by: z.union([z.literal("name"), z.literal("cid")]),
});
export type SelectedMoleculeSchema = typeof selectedMoleculeSchema;
export type SelectedMolecule = z.infer<SelectedMoleculeSchema>;
