import { useAtom } from "jotai";
import {
  hideBallsAtom,
  cloudTypeAtom,
  hideSticksAtom,
  canvasStateAtom,
} from "@state";
import { StickBonds } from "./StickBonds";
import { BallElements } from "./BallElements";
import { AtomicClouds } from "./AtomicClouds";
import { VanDerWaalsClouds } from "./VanDerWaalsCloud";
import { MoleculeObject } from "@utils";
import { Scene, Vector3 } from "three";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { ShrinkWrapCloud } from "./ShrinkwrapCloud";
import { FOV, SCALE_FACTOR } from "@constants";
import { SDFCloud } from "./SDFCloud";
import { MEPCloud } from "./Mep";

export function Molecule({
  molecule,
}: {
  molecule: MoleculeObject;
  onExport?: (scene: Scene) => void;
}) {
  const { atoms, bonds, atomPartialCharges, base64 } = molecule;
  const [hideBalls] = useAtom(hideBallsAtom);
  const [hideSticks] = useAtom(hideSticksAtom);
  const [cloudType] = useAtom(cloudTypeAtom);
  const [, setCanvasState] = useAtom(canvasStateAtom);

  const rootState = useThree();

  useEffect(() => {
    setCanvasState(() => rootState);
  }, [rootState, setCanvasState]);

  useEffect(() => {
    const { x: xMin, y: yMin, z: zMin } = molecule.extents.min;
    const { x: xMax, y: yMax, z: zMax } = molecule.extents.max;
    const maxDim = Math.max(xMax, yMax, zMax);
    const calcedZ = Math.abs(maxDim / 2 / Math.tan(FOV / 2)) * SCALE_FACTOR;

    rootState.camera.lookAt(xMin, yMin, zMin);
    rootState.camera.position.setZ(calcedZ);
  }, [molecule, rootState.camera]);

  return (
    atoms.length && (
      <group name="molecule">
        {!hideSticks && <StickBonds atoms={atoms} bonds={bonds} />}
        {!hideBalls && <BallElements atoms={atoms} />}
        {cloudType === "atomic" && <AtomicClouds atoms={atoms} />}
        {cloudType === "vanderwaals" && (
          <VanDerWaalsClouds atoms={atoms} cacheKey={base64} />
        )}
        {cloudType === "shrinkwrap" && <ShrinkWrapCloud atoms={atoms} />}
        {cloudType === "sdf" && <SDFCloud atoms={atoms} />}
        {cloudType === "mep" && (
          <MEPCloud
            atoms={atoms}
            atomPartialCharges={atomPartialCharges}
            moleculeCenter={
              new Vector3(
                molecule.extents.mid.x,
                molecule.extents.mid.y,
                molecule.extents.mid.z
              )
            }
          />
        )}
      </group>
    )
  );
}
