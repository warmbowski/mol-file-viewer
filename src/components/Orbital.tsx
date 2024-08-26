import { useRef } from "react";
import { useAtom } from "jotai";
import { MeshProps } from "@react-three/fiber";
import { Color, ColorRepresentation, SphereGeometry } from "three";
import { DEFAULT_CLOUD_COLOR } from "../constants";
import { debugAtom } from "../state/app-state";

import fragmentShader from "../shaders/electronCloudAltFragment.glsl?raw";
import vertexShader from "../shaders/electronCloudVertex.glsl?raw";

interface OrbitalProps extends MeshProps {
  hybridization?: string;
  radius?: number;
  color?: ColorRepresentation;
}

export function SOrbital({
  radius,
  position,
  color = DEFAULT_CLOUD_COLOR,
}: OrbitalProps) {
  const [debug] = useAtom(debugAtom);

  return (
    <mesh position={position} renderOrder={0.5} scale={[1.01, 1.01, 1.01]}>
      <sphereGeometry args={[radius && radius + 0.01, 20, 20]} />
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

export function POrbital({ radius, position, color }: OrbitalProps) {
  const pxGeom = useRef<SphereGeometry>(null!);
  const [debug] = useAtom(debugAtom);

  return (
    <group>
      <mesh position={position} scale={[1 / 2, 1 / 4, 1 / 4]}>
        <sphereGeometry ref={pxGeom} args={[radius, 20, 20]} />
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
    </group>
  );
}
