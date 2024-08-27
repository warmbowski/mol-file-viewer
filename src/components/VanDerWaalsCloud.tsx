import { useMemo } from "react";
import { useAtom } from "jotai";
import { Color, SphereGeometry } from "three";
import { Addition, Base, Geometry } from "@react-three/csg";
import { DEFAULT_CLOUD_COLOR } from "../constants";
import { MoleculeAtom } from "../utils/readMolfile";
import { debugAtom, periodicTableAtom } from "../state/app-state";

import fragmentShader from "../shaders/electronCloudAltFragment.glsl?raw";
import vertexShader from "../shaders/electronCloudVertex.glsl?raw";

interface VanDerWaalsCloudsProps {
  atoms: MoleculeAtom[];
}

export function VanDerWaalsClouds({ atoms }: VanDerWaalsCloudsProps) {
  const [debug] = useAtom(debugAtom);
  const [periodicTable] = useAtom(periodicTableAtom);

  const cloudGeometries = useMemo(
    () =>
      atoms.map((atom) => {
        const elementData = periodicTable.getElementDataBySymbol(atom.symbol);
        const geom = new SphereGeometry(
          elementData?.radius.vanderwaals,
          24,
          24
        );
        geom.translate(atom.x, atom.y, atom.z);
        return geom;
      }),
    [atoms, periodicTable]
  );

  return (
    <mesh scale={[1.01, 1.01, 1.01]}>
      <Geometry>
        <Base name="base" geometry={cloudGeometries[0]} />
        {cloudGeometries.map((geo, idx) => (
          <Addition key={`${idx}`} name={`atom${idx}-cloud`} geometry={geo} />
        ))}
      </Geometry>
      <shaderMaterial
        wireframe={debug}
        uniforms={{
          color: { value: new Color(DEFAULT_CLOUD_COLOR) },
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthTest={true}
        depthWrite={true}
      />
    </mesh>
  );
}
