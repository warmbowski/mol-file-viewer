import {
  RadiusType,
  ELEMENT_DATA_MAP,
  // StericToHybridization,
} from "../constants";
import { MoleculeAtom } from "../utils/readMolfile";
import { useRef } from "react";
import { MeshProps } from "@react-three/fiber";
import { SphereGeometry } from "three";
import { useAtom } from "jotai";
import { noHAtom } from "../state/app-state";

import fragmentShader from "../shaders/electronCloudFragment.glsl?raw";
import vertexShader from "../shaders/electronCloudVertex.glsl?raw";

export function ElectronCloud({ atom }: { atom: MoleculeAtom }) {
  const [noH] = useAtom(noHAtom);
  const elementData = ELEMENT_DATA_MAP.get(atom.symbol);
  // const stericNumber = atom.bondedAtoms.length + (elementData?.lonePair || 0);
  // const hybridization = StericToHybridization[stericNumber];
  // console.log(hybridization);
  const radius = !Number.isNaN(elementData?.radii[RadiusType.CovalentSingle])
    ? elementData?.radii[RadiusType.CovalentSingle]
    : undefined;

  if (noH && atom.symbol === "H") {
    return null;
  }

  return (
    <group>
      <SOrbital radius={radius} position={[atom.x, atom.y, atom.z]} />
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
