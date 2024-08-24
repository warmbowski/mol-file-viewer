import { ELEMENT_DATA_MAP, RadiusType } from "../constants";
import { MoleculeAtom } from "../utils/readMolfile";
import { SphereGeometry } from "three";
import { useMemo } from "react";
import { Addition, Base, Geometry } from "@react-three/csg";

import fragmentShader from "../shaders/electronCloudAltFragment.glsl?raw";
import vertexShader from "../shaders/electronCloudVertex.glsl?raw";

interface VanDerWaalsCloudsProps {
  atoms: MoleculeAtom[];
}

export function VanDerWaalsClouds({ atoms }: VanDerWaalsCloudsProps) {
  const cloudGeometries = useMemo(
    () =>
      atoms.map((atom) => {
        const elementData = ELEMENT_DATA_MAP.get(atom.symbol);
        const geom = new SphereGeometry(
          elementData?.radii[RadiusType.VanDerWaals],
          32,
          32
        );
        geom.translate(atom.x, atom.y, atom.z);
        return geom;
      }),
    [atoms]
  );

  return (
    <mesh>
      <Geometry>
        <Base name="base" geometry={cloudGeometries[0]} />
        {cloudGeometries.map((geo, idx) => (
          <Addition name={`atom${idx}-cloud`} geometry={geo} />
        ))}
      </Geometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthTest={true}
        depthWrite={true}
      />
    </mesh>
  );
}
