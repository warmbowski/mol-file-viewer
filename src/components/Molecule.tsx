import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { Progress } from "./Progress";
import { useGetMolecule } from "../api/hooks/useGetMolecule";
import { useAtom } from "jotai";
import { hideBallsAtom, moleculeAtom } from "../state/app-state";
import { StickBonds } from "./StickBonds";
import { BallElements } from "./BallElements";

export function Molecule() {
  const [molecule] = useAtom(moleculeAtom);
  const [hideBalls] = useAtom(hideBallsAtom);

  const { data, error, isFetching } = useGetMolecule(molecule);
  const atoms = useMemo(() => data?.atoms || [], [data?.atoms]);
  const bonds = useMemo(() => data?.bonds || [], [data?.bonds]);

  return (
    <group>
      <StickBonds atoms={atoms} bonds={bonds} />
      {hideBalls || <BallElements atoms={atoms} />}
      {isFetching && <Progress />}
      {error && <Text color="red">Error loading molecule</Text>}
    </group>
  );
}
