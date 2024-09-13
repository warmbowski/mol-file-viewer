import { useGetMolecule } from "@api";
import { ControlPanel } from "./ControlPanel";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { moleculeAtom } from "@state";
import { ElementCardList } from "./ElementCardList";
import { PTableSymbol } from "periodic-table-data-complete";
import { ProcessingToast } from "./ProcessingToast";

export function Dom() {
  const [molecule] = useAtom(moleculeAtom);

  const { data, error } = useGetMolecule(molecule);

  const symbols = useMemo(() => {
    return new Set(data?.atoms.map((atom) => atom.symbol as PTableSymbol));
  }, [data]);

  return !error ? (
    symbols.size && (
      <div>
        <ControlPanel />
        <ElementCardList symbols={[...symbols]} />
        <ProcessingToast />
      </div>
    )
  ) : (
    <div className="processing processing-error">
      <div>{`Problem Loading Mol/SDF file for molecule: ${molecule}. ${
        molecule === "custom" ? "Please verify file format." : ""
      }`}</div>
    </div>
  );
}
