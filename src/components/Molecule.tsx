import { useAtom } from "jotai";
import {
  hideBallsAtom,
  cloudTypeAtom,
  hideSticksAtom,
} from "../state/app-state";
import { StickBonds } from "./StickBonds";
import { BallElements } from "./BallElements";
import { AtomicClouds } from "./AtomicClouds";
import { VanDerWaalsClouds } from "./VanDerWaalsCloud";
import { MoleculeObject } from "../utils/readMolfile";

export function Molecule({ molecule }: { molecule: MoleculeObject }) {
  const { atoms, bonds, base64 } = molecule;
  const [hideBalls] = useAtom(hideBallsAtom);
  const [hideSticks] = useAtom(hideSticksAtom);
  const [cloudType] = useAtom(cloudTypeAtom);

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
