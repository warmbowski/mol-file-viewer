import { useAtom } from "jotai";
import { MoleculeAtom } from "../utils/readMolfile";
import { noHAtom } from "../state/app-state";
import { SOrbital } from "./Orbital";
import { periodicTableBySymbolMap } from "../constants/periodicTable";

export function AtomicCloud({ atom }: { atom: MoleculeAtom }) {
  const [noH] = useAtom(noHAtom);
  const elementData = periodicTableBySymbolMap.get(atom.symbol);
  // const stericNumber = atom.bondedAtoms.length + (elementData?.lonePair || 0);
  // const hybridization = StericToHybridization[stericNumber];
  // console.log(hybridization);

  if (noH && atom.symbol === "H") {
    return null;
  }

  return (
    <SOrbital
      radius={elementData?.radius.covalent}
      position={[atom.x, atom.y, atom.z]}
      color={elementData?.color}
    />
  );
}
