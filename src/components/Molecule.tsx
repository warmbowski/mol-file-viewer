import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { Progress } from "./Progress";
import { useGetMolecule } from "../api/hooks/useGetMolecule";
import { useAtom } from "jotai";
import {
  hideBallsAtom,
  hideCloudsAtom,
  hideSticksAtom,
  moleculeAtom,
} from "../state/app-state";
import { StickBonds } from "./StickBonds";
import { BallElements } from "./BallElements";
import { AtomicClouds } from "./AtomicClouds";
import { VanDerWaalsClouds } from "./VanDerWaalsCloud";

export function Molecule() {
  const [molecule] = useAtom(moleculeAtom);
  const [hideBalls] = useAtom(hideBallsAtom);
  const [hideSticks] = useAtom(hideSticksAtom);
  const [hideClouds] = useAtom(hideCloudsAtom);

  const { data, error, isFetching } = useGetMolecule(molecule);
  const atoms = useMemo(() => data?.atoms || [], [data?.atoms]);
  const bonds = useMemo(() => data?.bonds || [], [data?.bonds]);

  return isFetching ? (
    <Progress />
  ) : (
    <>
      {error && <Text color="red">Error loading molecule</Text>}
      {atoms.length && (
        <group>
          {!hideSticks && <StickBonds atoms={atoms} bonds={bonds} />}
          {!hideBalls && <BallElements atoms={atoms} />}
          {!hideClouds && <AtomicClouds atoms={atoms} />}
          {<VanDerWaalsClouds atoms={atoms} />}
        </group>
      )}
    </>
  );
}
