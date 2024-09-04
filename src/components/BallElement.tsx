import { useMemo } from "react";
import { useAtom } from "jotai";
import { MeshProps } from "@react-three/fiber";
import { Color } from "three";
import {
  ballRadiusAtom,
  debugAtom,
  noHAtom,
  periodicTableAtom,
} from "../state/app-state";
import { ElementSymbol } from "../constants/types";
import { scaleRadius } from "../utils/scaleModelData";

interface BallElementProps extends MeshProps {
  symbol: ElementSymbol;
}

export function BallElement({ symbol, ...meshProps }: BallElementProps) {
  const [noH] = useAtom(noHAtom);
  const [debug] = useAtom(debugAtom);
  const [periodicTable] = useAtom(periodicTableAtom);
  const [ballRadius] = useAtom(ballRadiusAtom);

  const { color, radius } = useMemo(() => {
    const elementData = periodicTable.getElementDataBySymbol(symbol);

    return {
      color: elementData?.color,
      radius: scaleRadius(elementData?.radius?.[ballRadius]),
    };
  }, [ballRadius, periodicTable, symbol]);

  if (noH && symbol === "H") {
    return null;
  }

  return (
    <mesh {...meshProps}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        wireframe={debug}
        color={new Color(color)}
        roughness={0.5}
        metalness={0.5}
      />
    </mesh>
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
