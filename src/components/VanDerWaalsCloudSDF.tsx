/**
 * Signed Distance Field (SDF) Raymarching representation of Van der Waals clouds.
 * based on https://github.com/MelonCode/r3f-raymarching/tree/main
 */
import { useMemo, useRef } from "react";
import { useAtom } from "jotai";
import { Color, PMREMGenerator, Vector3, Vector4 } from "three";
import { DEFAULT_CLOUD_COLOR } from "../constants";
import { MoleculeAtom } from "../utils/readMolfile";
import { periodicTableAtom } from "../state/app-state";

import Raymarcher, {
  Operation,
  PBRMaterial,
  SDFBox,
  SDFCapsule,
  SDFLayer,
  SDFSphere,
} from "../utils/raymarching";
import { Object3DNode, extend, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

extend({
  Raymarcher,
  SdfSphere: SDFSphere,
  SdfBox: SDFBox,
  SdfCapsule: SDFCapsule,
  SdfLayer: SDFLayer,
});

declare module "@react-three/fiber" {
  interface ThreeElements {
    raymarcher: Object3DNode<Raymarcher, typeof Raymarcher>;
    sdfSphere: Object3DNode<SDFSphere, typeof SDFSphere>;
    sdfLayer: Object3DNode<SDFLayer, typeof SDFLayer>;
  }
}

interface VanDerWaalsCloudsProps {
  atoms: MoleculeAtom[];
}

export function VanDerWaalsClouds({ atoms }: VanDerWaalsCloudsProps) {
  const [periodicTable] = useAtom(periodicTableAtom);

  const { gl } = useThree();
  const envMap = useMemo(
    () => new PMREMGenerator(gl).fromScene(new RoomEnvironment()).texture,
    [gl]
  );

  const raymarcherRef = useRef<Raymarcher>(null!);

  const materials: PBRMaterial[] = useMemo(
    () =>
      atoms.map((atom) => {
        const elementData = periodicTable.getElementDataBySymbol(atom.symbol);

        console.log("radius", atom.symbol, elementData?.radius.vanderwaals);

        return {
          color: new Color(DEFAULT_CLOUD_COLOR),
          params: new Vector4(elementData?.radius.vanderwaals, 0.5),
          operation: Operation.UNION,
        };
      }),
    [atoms, periodicTable]
  );

  const spheres = useMemo(
    () =>
      atoms.map((atom, idx) => {
        return (
          <sdfSphere
            key={idx}
            materialIndex={idx}
            position={[atom.x, atom.y, atom.z]}
            operation={Operation.UNION}
            blending={0}
            scale={new Vector3(2.35, 2.35, 2.35)}
          />
        );
      }),
    [atoms]
  );

  return (
    <>
      <raymarcher
        ref={raymarcherRef}
        envMap={envMap}
        envMapIntensity={0.6}
        // blending={0.0}
        materials={materials}
      >
        <sdfLayer>{spheres}</sdfLayer>
      </raymarcher>
    </>
  );
}
