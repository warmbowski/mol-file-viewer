import { useAtom } from "jotai";
import { MoleculeAtom } from "../utils/readMolfile";
import { noHAtom, periodicTableAtom } from "../state/app-state";
import { SOrbital } from "./Orbital";
import { useMemo } from "react";
import { scalePosition, scaleRadius } from "../utils/scaleModelData";

export function AtomicCloud({ atom }: { atom: MoleculeAtom }) {
  const [noH] = useAtom(noHAtom);
  const [periodicTable] = useAtom(periodicTableAtom);

  const elementData = useMemo(
    () => periodicTable.getElementDataBySymbol(atom.symbol),
    [periodicTable, atom.symbol]
  );
  // const stericNumber = atom.bondedAtoms.length + (elementData?.lonePair || 0);
  // const hybridization = StericToHybridization[stericNumber];
  // console.log(hybridization);

  if (noH && atom.symbol === "H") {
    return null;
  }

  return (
    <SOrbital
      radius={scaleRadius(elementData?.radius.covalent)}
      position={scalePosition(atom.x, atom.y, atom.z)}
      color={elementData?.color}
    />
  );
}
