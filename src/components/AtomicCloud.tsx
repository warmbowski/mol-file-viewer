import {
  RadiusType,
  ELEMENT_DATA_MAP,
  // StericToHybridization,
} from "../constants";
import { MoleculeAtom } from "../utils/readMolfile";
import { useAtom } from "jotai";
import { noHAtom } from "../state/app-state";
import { SOrbital } from "./Orbital";

export function AtomicCloud({ atom }: { atom: MoleculeAtom }) {
  const [noH] = useAtom(noHAtom);
  const elementData = ELEMENT_DATA_MAP.get(atom.symbol);
  // const stericNumber = atom.bondedAtoms.length + (elementData?.lonePair || 0);
  // const hybridization = StericToHybridization[stericNumber];
  // console.log(hybridization);

  if (noH && atom.symbol === "H") {
    return null;
  }

  return (
    <SOrbital
      radius={elementData?.radii[RadiusType.CovalentSingle]}
      position={[atom.x, atom.y, atom.z]}
      color={elementData?.color}
    />
  );
}
