import { MoleculeAtom, MoleculeBond } from "../utils/readMolfile";
import { ElectronCloud } from "./ElectronCloud";

interface ElectronCloudsProps {
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

export function ElectronClouds({ atoms, bonds }: ElectronCloudsProps) {
  return bonds.map((bond, index) => (
    <ElectronCloud
      key={index}
      atom1={atoms[bond.atom1 - 1]}
      atom2={atoms[bond.atom2 - 1]}
      bondType={bond.type}
    />
  ));
}
