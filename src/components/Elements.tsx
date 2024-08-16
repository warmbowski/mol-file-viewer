import { MeshProps } from "@react-three/fiber";
import { ColorRepresentation } from "three";
import { BondType, ELEMENT_DATA_MAP } from "../constants";
import { noHAtom } from "../state/app-state";
import { useAtom } from "jotai";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

interface ElementProps extends MeshProps {
  symbol: string;
  radius?: number;
  color?: ColorRepresentation;
}

export function Element({ symbol, ...meshProps }: ElementProps) {
  const ref = useRef<RapierRigidBody>(null!);
  const [noH] = useAtom(noHAtom);
  const { radii, color } = ELEMENT_DATA_MAP.get(symbol) || {};

  const radius = radii?.[BondType.NONE] || 0.2;

  if (noH && symbol === "H") {
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
  return <Element symbol="C" {...props} />;
}

export function H(props: MeshProps) {
  return <Element symbol="H" {...props} />;
}

export function O(props: MeshProps) {
  return <Element symbol="O" {...props} />;
}

export function N(props: MeshProps) {
  return <Element symbol="N" {...props} />;
}

export function S(props: MeshProps) {
  return <Element symbol="S" {...props} />;
}

export function P(props: MeshProps) {
  return <Element symbol="P" {...props} />;
}

export function F(props: MeshProps) {
  return <Element symbol="F" {...props} />;
}

export function Cl(props: MeshProps) {
  return <Element symbol="Cl" {...props} />;
}

export function Br(props: MeshProps) {
  return <Element symbol="Br" {...props} />;
}

export function I(props: MeshProps) {
  return <Element symbol="I" {...props} />;
}
