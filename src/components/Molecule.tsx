import { useMemo } from "react";
import { Vector3 } from "three";
import { Text } from "@react-three/drei";
import { Element } from "./Elements";
import { Bond } from "./Bonds";
import { Progress } from "./Progress";
import { useGetMolecule } from "../api/hooks/useGetMolecule";
import { useAtom } from "jotai";
import { hideBallsAtom, moleculeAtom } from "../state/app-state";

export function Molecule() {
  const [molecule] = useAtom(moleculeAtom);
  const [hideBalls] = useAtom(hideBallsAtom);

  const { data, error, isFetching } = useGetMolecule(molecule);
  const atoms = useMemo(() => data?.atoms || [], [data?.atoms]);
  const bonds = useMemo(() => data?.bonds || [], [data?.bonds]);

  const atomicRadii = useMemo(() => {
    return hideBalls
      ? []
      : atoms.map((atom, index) => {
          const { x, y, z, symbol } = atom;
          return (
            <Element
              key={`${symbol}${index}`}
              symbol={symbol}
              position={new Vector3(x, y, z)}
            />
          );
        });
  }, [atoms, hideBalls]);

  const atomicBonds = useMemo(() => {
    return bonds.map((bond, index) => {
      const { atom1, atom2, type } = bond;

      return (
        <Bond
          key={index}
          atoms={atoms}
          atom1={atom1}
          atom2={atom2}
          bondType={type}
        />
      );
    });
  }, [atoms, bonds]);

  return (
    <group>
      {atomicBonds}
      {atomicRadii}
      {isFetching && <Progress />}
      {error && <Text color="red">Error loading molecule</Text>}
    </group>
  );
}
