import { BondType, ELEMENT_DATA_MAP } from "../constants";
import { MolObj } from "../utils/readMolfile";

import fragmentShader from "../shaders/fragment-2.glsl?raw";
import vertexShader from "../shaders/vertex.glsl?raw";
import { useMemo, useRef } from "react";
import { MeshProps } from "@react-three/fiber";
import { SphereGeometry } from "three";
import { useAtom } from "jotai";
import { noHAtom } from "../state/app-state";

export function ElectronClouds({
  atom1,
  atom2,
  bondType,
}: {
  atom1: MolObj["atoms"][0];
  atom2: MolObj["atoms"][0];
  bondType: BondType;
}) {
  const [noH] = useAtom(noHAtom);
  const rad1 = useMemo(
    () => ELEMENT_DATA_MAP.get(atom1.type)?.radii[bondType],
    [bondType, atom1.type]
  );
  const rad2 = useMemo(
    () => ELEMENT_DATA_MAP.get(atom2.type)?.radii[bondType],
    [bondType, atom2.type]
  );

  if (noH && (atom1.type === "H" || atom2.type === "H")) {
    return null;
  }

  return (
    <group>
      <SOrbital radius={rad1} position={[atom1.x, atom1.y, atom1.z]} />
      <SOrbital radius={rad2} position={[atom2.x, atom2.y, atom2.z]} />
    </group>
  );
}

interface OrbitalProps extends MeshProps {
  radius: number | undefined;
  hybridization?: string;
}

export function SOrbital({ radius, position }: OrbitalProps) {
  return (
    <group>
      <mesh position={position}>
        <sphereGeometry args={[radius, 32, 32]} />
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
