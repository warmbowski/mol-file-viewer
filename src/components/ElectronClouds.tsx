import { MoleculeAtom, MoleculeBond } from "../utils/readMolfile";
import { ElectronCloud } from "./ElectronCloud";

interface ElectronCloudsProps {
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

export function ElectronClouds({ atoms }: ElectronCloudsProps) {
  return atoms.map((atom) => <ElectronCloud key={atom.id} atom={atom} />);
}
