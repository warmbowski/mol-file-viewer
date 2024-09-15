import { useGetConformerMolecule } from "@api";
import { ControlPanel } from "./ControlPanel";
import { useMemo } from "react";
import { useAtom } from "jotai";
import { pubChemMoleculeAtom } from "@state";
import { ElementCardList } from "./ElementCardList";
import { PTableSymbol } from "periodic-table-data-complete";
import { ProcessingToast } from "./ProcessingToast";

export function Dom() {
  const [moleculeName] = useAtom(pubChemMoleculeAtom);

  const { data, error } = useGetConformerMolecule(
    moleculeName?.text || "",
    "name"
  );

  const symbols = useMemo(() => {
    return new Set(data?.atoms.map((atom) => atom.symbol as PTableSymbol));
  }, [data]);

  return !error ? (
    <>
      <ControlPanel />
      {symbols.size > 0 && <ElementCardList symbols={[...symbols]} />}
      <ProcessingToast />
    </>
  ) : (
    <div className="processing processing-error">
      <div>{`Problem Loading Mol/SDF file for molecule: ${moleculeName?.text}.`}</div>
    </div>
  );
}
