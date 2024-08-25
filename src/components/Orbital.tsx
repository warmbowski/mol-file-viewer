import { useRef } from "react";
import { MeshProps } from "@react-three/fiber";
import { Color, ColorRepresentation, SphereGeometry } from "three";
import { DEFAULT_CLOUD_COLOR } from "../constants";
import { useAtom } from "jotai";
import { debugAtom } from "../state/app-state";

import fragmentShader from "../shaders/electronCloudAltFragment.glsl?raw";
import vertexShader from "../shaders/electronCloudVertex.glsl?raw";

interface OrbitalProps extends MeshProps {
  radius: number | undefined;
  hybridization?: string;
  color?: ColorRepresentation;
}

export function SOrbital({
  radius,
  position,
  color = DEFAULT_CLOUD_COLOR,
}: OrbitalProps) {
  const [debug] = useAtom(debugAtom);

  return (
    <mesh position={position} renderOrder={0.5}>
      <sphereGeometry args={[radius, 20, 20]} />
      <shaderMaterial
        wireframe={debug}
        uniforms={{
          color: { value: new Color(color) },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthTest
        depthWrite
      />
    </mesh>
  );
}

export function POrbital({ radius, position }: OrbitalProps) {
  const pxGeom = useRef<SphereGeometry>(null!);

  return (
    <group>
      <mesh position={position} scale={[1 / 2, 1 / 4, 1 / 4]}>
        <sphereGeometry ref={pxGeom} args={[radius, 20, 20]} />
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
