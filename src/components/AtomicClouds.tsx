import { MoleculeAtom } from "../utils/readMolfile";
import { AtomicCloud } from "./AtomicCloud";

interface AtomicCloudsProps {
  atoms: MoleculeAtom[];
}

export function AtomicClouds({ atoms }: AtomicCloudsProps) {
  return atoms.map((atom) => <AtomicCloud key={atom.id} atom={atom} />);
}
