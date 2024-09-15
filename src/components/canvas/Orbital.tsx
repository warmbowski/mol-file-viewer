import { useMemo } from "react";
import { useAtom } from "jotai";
import {
  Color,
  ColorRepresentation,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
} from "three";
import { DEFAULT_CLOUD_COLOR } from "@constants";
import { debugAtom } from "@state";

import fragmentShader from "@assets/shaders/electronCloudAltFragment.glsl?raw";
import vertexShader from "@assets/shaders/electronCloudVertex.glsl?raw";

interface OrbitalProps {
  radius?: number;
  color?: ColorRepresentation;
  position: Vector3;
}

export function SOrbital({
  radius,
  position,
  color = DEFAULT_CLOUD_COLOR,
}: OrbitalProps) {
  const [debug] = useAtom(debugAtom);

  const mesh = useMemo(() => {
    const geometry = new SphereGeometry(radius, 20, 20);
    const material = new ShaderMaterial({
      wireframe: debug,
      uniforms: {
        color: { value: new Color(color) },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: true,
      depthWrite: true,
    });

    const mesh = new Mesh(geometry, material);
    if (position) {
      const [x, y, z] = position;
      mesh.position.set(x, y, z);
    }

    return mesh;
  }, [color, debug, position, radius]);

  return <group>{mesh && <primitive object={mesh} />}</group>;
}

export function POrbital({ radius, position, color }: OrbitalProps) {
  const [debug] = useAtom(debugAtom);

  const mesh = useMemo(() => {
    const geometry = new SphereGeometry(radius, 20, 20);
    const material = new ShaderMaterial({
      wireframe: debug,
      uniforms: {
        color: { value: new Color(color) },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: true,
      depthWrite: true,
    });

    const mesh = new Mesh(geometry, material);
    if (position) {
      const [x, y, z] = position;
      mesh.position.set(x, y, z);
    }

    return mesh;
  }, [color, debug, position, radius]);

  return <group>{mesh && <primitive object={mesh} />}</group>;
}
