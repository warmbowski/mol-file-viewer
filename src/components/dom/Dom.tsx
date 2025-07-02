import { useGetConformerMolecule } from "@api";
import { ControlPanel } from "./ControlPanel";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { selectedMoleculeAtom } from "@state";
import { ElementCardList } from "./ElementCardList";
import { PTableSymbol } from "periodic-table-data-complete";
import { ProcessingToast } from "./ProcessingToast";

export function Dom() {
  const [selectedMolecule] = useAtom(selectedMoleculeAtom);

  const { data: molecule, error } = useGetConformerMolecule(
    selectedMolecule?.text || "",
    "name"
  );

  const symbolCounts = useMemo(() => {
    if (!molecule || !molecule.atoms) return new Map<PTableSymbol, number>();
    return molecule.atoms.reduce((acc, atom) => {
      acc.set(atom.symbol, (acc.get(atom.symbol) || 0) + 1);
      return acc;
    }, new Map<PTableSymbol, number>());
  }, [molecule]);

  return (
    <>
      <ControlPanel />
      {symbolCounts.size > 0 && (
        <ElementCardList
          symbolCounts={symbolCounts}
          rawData={molecule?.molFileText || ""}
        />
      )}
      <ProcessingToast />
      {error && (
        <div className="processing processing-error">
          <div>{`Problem Loading Mol/SDF file for molecule: ${selectedMolecule?.text}.`}</div>
          <div>{`${error.message}`}</div>
        </div>
      )}
    </>
  );
}
