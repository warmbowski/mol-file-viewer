import { useMemo, useRef } from "react";
import { useAtom } from "jotai";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { MeshProps } from "@react-three/fiber";
import { Color } from "three";
import {
  ballRadiusAtom,
  debugAtom,
  dropElementsAtom,
  noHAtom,
  periodicTableAtom,
} from "../state/app-state";

interface BallElementProps extends MeshProps {
  symbol: string;
}

export function BallElement({ symbol, ...meshProps }: BallElementProps) {
  const ref = useRef<RapierRigidBody>(null!);
  const [noH] = useAtom(noHAtom);
  const [debug] = useAtom(debugAtom);
  const [periodicTable] = useAtom(periodicTableAtom);

  const [ballRadius] = useAtom(ballRadiusAtom);
  const [dropElements] = useAtom(dropElementsAtom);

  const { color, radius } = useMemo(() => {
    const elementData = periodicTable.getElementDataBySymbol(symbol);

    return {
      color: elementData?.color,
      radius: elementData?.radius?.[ballRadius],
    };
  }, [ballRadius, periodicTable, symbol]);

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
          color={new Color(color)}
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
