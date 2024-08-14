import { MeshProps } from "@react-three/fiber";

export function Bond(props: MeshProps) {
  return (
    <mesh {...props}>
      <meshBasicMaterial color={0xffffff} />
    </mesh>
  );
}
