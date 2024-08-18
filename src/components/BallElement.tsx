import { MeshProps } from "@react-three/fiber";
import { ColorRepresentation } from "three";
import { BondType, ELEMENT_DATA_MAP } from "../constants";
import { ballRadiusAtom, noHAtom } from "../state/app-state";
import { useAtom } from "jotai";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef } from "react";

interface BallElementProps extends MeshProps {
  symbol: string;
  radius?: number;
  color?: ColorRepresentation;
}

export function BallElement({ symbol, ...meshProps }: BallElementProps) {
  const ref = useRef<RapierRigidBody>(null!);
  const [noH] = useAtom(noHAtom);
  const [ballRadius] = useAtom(ballRadiusAtom);
  const { radii, color } = ELEMENT_DATA_MAP.get(symbol) || {};

  const radius = radii?.[ballRadius as BondType] || 0.2;

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
  return <BallElement symbol="C" {...props} />;
}

export function H(props: MeshProps) {
  return <BallElement symbol="H" {...props} />;
}

export function O(props: MeshProps) {
  return <BallElement symbol="O" {...props} />;
}

export function N(props: MeshProps) {
  return <BallElement symbol="N" {...props} />;
}

export function S(props: MeshProps) {
  return <BallElement symbol="S" {...props} />;
}

export function P(props: MeshProps) {
  return <BallElement symbol="P" {...props} />;
}

export function F(props: MeshProps) {
  return <BallElement symbol="F" {...props} />;
}

export function Cl(props: MeshProps) {
  return <BallElement symbol="Cl" {...props} />;
}

export function Br(props: MeshProps) {
  return <BallElement symbol="Br" {...props} />;
}

export function I(props: MeshProps) {
  return <BallElement symbol="I" {...props} />;
}
