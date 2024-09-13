import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, Vector3 } from "three";

export function Progress() {
  const electron1 = useRef<Mesh>(null!);
  const proton1 = useRef<Mesh>(null!);
  const orbit = useRef<Mesh>(null!);
  const centeredOn = new Vector3(0, 0, 0);
  const orbitRadius = 2;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 4;
    const orbitPos: [number, number, number] = [
      Math.cos(t) * orbitRadius,
      Math.sin(t) * orbitRadius,
      0,
    ];
    electron1.current.position.set(...orbitPos);
  });

  return (
    <group scale={0.2} rotation={[0.1, 0.25, 0]}>
      <mesh ref={proton1} position={centeredOn}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshPhongMaterial color={"red"} />
      </mesh>
      <mesh ref={orbit} position={centeredOn}>
        <torusGeometry args={[orbitRadius, 0.1, 32, 32]} />
        <meshPhongMaterial color={"yellow"} opacity={0.3} transparent />
      </mesh>
      <mesh ref={electron1}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshPhongMaterial color={"white"} />
      </mesh>
    </group>
  );
}
