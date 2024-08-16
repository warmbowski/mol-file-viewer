import { MeshProps } from "@react-three/fiber";
import { ColorRepresentation } from "three";
import { BondType, ELEMENT_DATA_MAP } from "../constants";
import { noHAtom } from "../state/app-state";
import { useAtom } from "jotai";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

interface ElementProps extends MeshProps {
  type: string;
  radius?: number;
  color?: ColorRepresentation;
}

export function Element({ type, ...meshProps }: ElementProps) {
  const ref = useRef<RapierRigidBody>(null!);
  const [noH] = useAtom(noHAtom);
  const { radii, color } = ELEMENT_DATA_MAP.get(type) || {};

  const radius = radii?.[BondType.NONE] || 0.2;

  if (noH && type === "H") {
    return null;
  }

  // console.log("Element", type, radius, color);

  return (
    <RigidBody
      ref={ref}
      type={"fixed"}
      enabledRotations={[false, false, true]}
      enabledTranslations={[true, true, false]}
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      colliders={"ball"}
    >
      <mesh {...meshProps}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.5}
          metalness={0.5}
          // transparent
          // opacity={0.75}
          // depthTest
          // depthWrite
        />
      </mesh>
    </RigidBody>
  );
}

export function C(props: MeshProps) {
  return <Element type="C" {...props} />;
}

export function H(props: MeshProps) {
  return <Element type="H" {...props} />;
}

export function O(props: MeshProps) {
  return <Element type="O" {...props} />;
}

export function N(props: MeshProps) {
  return <Element type="N" {...props} />;
}

export function S(props: MeshProps) {
  return <Element type="S" {...props} />;
}

export function P(props: MeshProps) {
  return <Element type="P" {...props} />;
}

export function F(props: MeshProps) {
  return <Element type="F" {...props} />;
}

export function Cl(props: MeshProps) {
  return <Element type="Cl" {...props} />;
}

export function Br(props: MeshProps) {
  return <Element type="Br" {...props} />;
}

export function I(props: MeshProps) {
  return <Element type="I" {...props} />;
}
