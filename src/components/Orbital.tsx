import { useRef } from "react";
import { MeshProps } from "@react-three/fiber";
import { SphereGeometry } from "three";

import fragmentShader from "../shaders/electronCloudFragment.glsl?raw";
import vertexShader from "../shaders/electronCloudVertex.glsl?raw";

interface OrbitalProps extends MeshProps {
  radius: number | undefined;
  hybridization?: string;
}

export function SOrbital({ radius, position }: OrbitalProps) {
  return (
    <group>
      <mesh position={position} renderOrder={0.5}>
        <sphereGeometry args={[radius, 32, 32]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthTest
          depthWrite
        />
      </mesh>
    </group>
  );
}

export function POrbital({ radius, position }: OrbitalProps) {
  const pxGeom = useRef<SphereGeometry>(null!);

  return (
    <group>
      <mesh position={position} scale={[1 / 2, 1 / 4, 1 / 4]}>
        <sphereGeometry ref={pxGeom} args={[radius, 32, 32]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          opacity={0.5}
          transparent
          depthTest
          depthWrite
        />
      </mesh>
    </group>
  );
}
