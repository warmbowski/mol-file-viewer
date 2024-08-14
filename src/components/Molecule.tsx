import { useMemo } from "react";
import { Vector3 } from "three";
import { MolObj } from "../utils/readMolfile";
import { Element } from "./Elements";
import { Bond } from "./Bonds";

export function Molecule({ atoms, bonds }: MolObj) {
  const elements = useMemo(() => {
    return atoms.map((atom, index) => {
      const { x, y, z, type } = atom;
      return (
        <Element
          key={`${type}${index}`}
          type={type}
          position={new Vector3(x, y, z)}
        />
      );
    });
  }, [atoms]);

  const elementBonds = useMemo(() => {
    return bonds.map((bond, index) => {
      const { atom1, atom2, type } = bond;
      const { x: x1, y: y1, z: z1 } = atoms[atom1 - 1];
      const { x: x2, y: y2, z: z2 } = atoms[atom2 - 1];

      const start = new Vector3(x1, y1, z1);
      const end = new Vector3(x2, y2, z2);

      return <Bond key={index} from={start} to={end} bondType={type} />;
    });
  }, [atoms, bonds]);

  return (
    <group>
      {elements}
      {elementBonds}
    </group>
  );
}
