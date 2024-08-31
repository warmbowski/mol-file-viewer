import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { Progress } from "./Progress";
import { useGetMolecule } from "../api/hooks/useGetMolecule";
import { useAtom } from "jotai";
import {
  hideBallsAtom,
  cloudTypeAtom,
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
  const [cloudType] = useAtom(cloudTypeAtom);

  const { data, error, isFetching } = useGetMolecule(molecule);
  const atoms = useMemo(() => data?.atoms || [], [data?.atoms]);
  const bonds = useMemo(() => data?.bonds || [], [data?.bonds]);

  return isFetching ? (
    <Progress />
  ) : (
    <>
      {error && <Text color="red">Error loading molecule</Text>}
      {data && atoms.length && (
        <group>
          {!hideSticks && <StickBonds atoms={atoms} bonds={bonds} />}
          {!hideBalls && <BallElements atoms={atoms} />}
          {cloudType === "atomic" && <AtomicClouds atoms={atoms} />}
          {cloudType === "vanderwaals" && (
            <VanDerWaalsClouds atoms={atoms} cacheKey={data.base64} />
          )}
        </group>
      )}
    </>
  );
}
