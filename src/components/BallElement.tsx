import { MeshProps } from "@react-three/fiber";
import { ColorRepresentation } from "three";
import { ELEMENT_DATA_MAP, FIXED_RADIUS } from "../constants";
import {
  ballRadiusAtom,
  debugAtom,
  dropElementsAtom,
  noHAtom,
} from "../state/app-state";
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
  const [debug] = useAtom(debugAtom);

  const [ballRadius] = useAtom(ballRadiusAtom);
  const [dropElements] = useAtom(dropElementsAtom);
  const { radii, color } = ELEMENT_DATA_MAP.get(symbol) || {};

  const radius = !Number.isNaN(radii?.[ballRadius])
    ? radii?.[ballRadius]
    : FIXED_RADIUS;

  if (noH && symbol === "H") {
    return null;
  }

  return (
    <RigidBody
      ref={ref}
      type={dropElements ? "dynamic" : "fixed"}
      enabledRotations={[false, false, true]}
      enabledTranslations={[true, true, false]}
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      colliders={"ball"}
    >
      <mesh {...meshProps}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          wireframe={debug}
          color={color}
          roughness={0.5}
          metalness={0.5}
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
