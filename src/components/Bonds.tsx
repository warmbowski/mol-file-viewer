import { useMemo } from "react";
import {
  Vector3,
  CapsuleGeometry,
  LineCurve3,
  Mesh,
  MeshBasicMaterial,
} from "three";
import { BondType } from "../constants";

interface BondProps {
  from: Vector3;
  to: Vector3;
  bondType: BondType;
}

export function Bond({ from, to, bondType }: BondProps) {
  const capsuleObj = useMemo(() => {
    const line = new LineCurve3(from, to);
    const distance = line.getLength();
    const radius =
      bondType === BondType.AROMATIC ? bondType / 20 : bondType / 15;
    const color = bondType === BondType.AROMATIC ? 0xffff00 : 0xffffff;

    // Not happy with adding bonds imperitively, but it works for now.
    // Couldn't figure out how to get rotation correct when using a
    // declarative Capsule from @rect-three/drei.
    const capsuleMaterial = new MeshBasicMaterial({ color });
    const capsuleGeometry = new CapsuleGeometry(radius, distance, 10, 20);
    capsuleGeometry.translate(0, distance / 2, 0);
    capsuleGeometry.rotateX(Math.PI / 2);

    const capsule = new Mesh(capsuleGeometry, capsuleMaterial);
    capsule.position.x = from.x;
    capsule.position.y = from.y;
    capsule.position.z = from.z;
    capsule.lookAt(to);

    return capsule;
  }, [bondType, from, to]);

  return <primitive object={capsuleObj} />;
}
