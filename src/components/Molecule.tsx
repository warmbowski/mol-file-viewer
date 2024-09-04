import { useAtom } from "jotai";
import {
  hideBallsAtom,
  cloudTypeAtom,
  hideSticksAtom,
  canvasStateAtom,
} from "../state/app-state";
import { StickBonds } from "./StickBonds";
import { BallElements } from "./BallElements";
import { AtomicClouds } from "./AtomicClouds";
import { VanDerWaalsClouds } from "./VanDerWaalsCloud";
import { MoleculeObject } from "../utils/readMolfile";
import { Scene } from "three";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export function Molecule({
  molecule,
}: {
  molecule: MoleculeObject;
  onExport?: (scene: Scene) => void;
}) {
  const { atoms, bonds, base64 } = molecule;
  const [hideBalls] = useAtom(hideBallsAtom);
  const [hideSticks] = useAtom(hideSticksAtom);
  const [cloudType] = useAtom(cloudTypeAtom);
  const [, setCanvasState] = useAtom(canvasStateAtom);

  const rootState = useThree();

  useEffect(() => {
    setCanvasState(() => rootState);
  }, [rootState, setCanvasState]);

  return (
    atoms.length && (
      <group>
        {!hideSticks && <StickBonds atoms={atoms} bonds={bonds} />}
        {!hideBalls && <BallElements atoms={atoms} />}
        {cloudType === "atomic" && <AtomicClouds atoms={atoms} />}
        {cloudType === "vanderwaals" && (
          <VanDerWaalsClouds atoms={atoms} cacheKey={base64} />
        )}
      </group>
    )
  );
}
