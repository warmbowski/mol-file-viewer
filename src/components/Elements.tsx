import { MeshProps } from "@react-three/fiber";
import { ColorRepresentation } from "three";

const ELEMENT_DATA_MAP = new Map([
  ["C", { radius: 0.8, color: 0x333333 }],
  ["H", { radius: 0.3, color: 0xffffff }],
  ["O", { radius: 0.5, color: 0xff0000 }],
  ["N", { radius: 0.6, color: 0x0000ff }],
  ["S", { radius: 0.8, color: 0xffff00 }],
  ["P", { radius: 0.9, color: 0xff00ff }],
  ["F", { radius: 0.4, color: 0x00ff00 }],
  ["Cl", { radius: 0.5, color: 0x00ff00 }],
  ["Br", { radius: 0.6, color: 0x00ff00 }],
  ["I", { radius: 0.7, color: 0x00ff00 }],
]);

interface ElementProps extends MeshProps {
  type: string;
  radius?: number;
  color?: ColorRepresentation;
}

export function Element({ type, ...meshProps }: ElementProps) {
  const { radius, color } = ELEMENT_DATA_MAP.get(type) || {};

  return (
    <mesh {...meshProps}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshPhongMaterial color={color} opacity={0.7} transparent />
    </mesh>
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
