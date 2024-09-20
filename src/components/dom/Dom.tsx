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

  const { data, error } = useGetConformerMolecule(
    selectedMolecule?.text || "",
    "name"
  );

  const symbols = useMemo(() => {
    return new Set(data?.atoms.map((atom) => atom.symbol as PTableSymbol));
  }, [data]);

  return (
    <>
      <ControlPanel />
      {symbols.size > 0 && <ElementCardList symbols={[...symbols]} />}
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
