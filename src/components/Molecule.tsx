import { useMemo } from "react";
import { Vector3 } from "three";
import { Text } from "@react-three/drei";
import { Element } from "./Elements";
import { Bond } from "./Bonds";
import { Progress } from "./Progress";
import { useGetMolecule } from "../api/hooks/useGetMolecule";
import { useAtom } from "jotai";
import { hideHydrogensAtom, moleculeAtom } from "../state/app-state";

export function Molecule() {
  const [molecule] = useAtom(moleculeAtom);
  const [hideHydrogens] = useAtom(hideHydrogensAtom);
  const { data, error, isFetching } = useGetMolecule(molecule);
  const { atoms, bonds } = data || { atoms: [], bonds: [] };

  const elements = useMemo(() => {
    return atoms
      .filter((atom) => {
        return hideHydrogens ? atom.type !== "H" : true;
      })
      .map((atom, index) => {
        const { x, y, z, type } = atom;
        return (
          <Element
            key={`${type}${index}`}
            type={type}
            position={new Vector3(x, y, z)}
          />
        );
      });
  }, [atoms, hideHydrogens]);

  const elementBonds = useMemo(() => {
    return bonds
      .filter((bond) => {
        if (hideHydrogens) {
          const { atom1, atom2 } = bond;
          const { type: type1 } = atoms[atom1 - 1];
          const { type: type2 } = atoms[atom2 - 1];
          return type1 !== "H" && type2 !== "H";
        }
        return true;
      })
      .map((bond, index) => {
        const { atom1, atom2, type } = bond;
        const { x: x1, y: y1, z: z1 } = atoms[atom1 - 1];
        const { x: x2, y: y2, z: z2 } = atoms[atom2 - 1];

        const start = new Vector3(x1, y1, z1);
        const end = new Vector3(x2, y2, z2);

        return <Bond key={index} from={start} to={end} bondType={type} />;
      });
  }, [atoms, bonds, hideHydrogens]);

  return (
    <group>
      {elements}
      {elementBonds}
      {isFetching && <Progress />}
      {error && <Text color="red">Error loading molecule</Text>}
    </group>
  );
}
