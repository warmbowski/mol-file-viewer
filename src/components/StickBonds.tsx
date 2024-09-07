import { MoleculeAtom, MoleculeBond } from "../utils/readMolfile";
import { StickBond } from "./StickBond";

interface StickBondsProps {
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

export function StickBonds({ atoms, bonds }: StickBondsProps) {
  return (
    <group name="bonds">
      {bonds.map((bond, index) => {
        const { atom1, atom2, type } = bond;

        return (
          <StickBond
            key={index}
            atoms={atoms}
            atom1={atom1}
            atom2={atom2}
            bondType={type}
          />
        );
      })}
    </group>
  );
}
