import { useMemo } from "react";
import { useAtom } from "jotai";
import {
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  BufferGeometry,
} from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { debugAtom, periodicTableAtom } from "@state";

import fragmentShader from "@assets/shaders/mepFragment.glsl?raw";
import vertexShader from "@assets/shaders/mepVertex.glsl?raw";
import { MoleculeAtom, scalePosition, scaleRadius } from "@utils";

interface MepCloudProps {
  atoms: MoleculeAtom[];
  atomPartialCharges: number[];
  moleculeCenter?: Vector3;
  chargeScale?: number;
}

export function MEPCloud({
  atoms,
  atomPartialCharges,
  moleculeCenter,
}: MepCloudProps) {
  const [periodicTable] = useAtom(periodicTableAtom);

  // Prepare arrays for atom data
  const atomPositions: number[] = [];
  const atomCharges: number[] = [];
  const atomRadii: number[] = [];
  const atomElectronegativities: number[] = [];

  // For geometry
  const sphereGeoms = atoms.map((atom) => {
    const elementData = periodicTable.getElementDataBySymbol(atom.symbol);
    const radius = scaleRadius(elementData?.radius.vanderwaals);
    const geom = new SphereGeometry(radius, 75, 75);
    const position = scalePosition(atom.x, atom.y, atom.z);
    geom.translate(position.x, position.y, position.z);
    return geom;
  });

  const cloudGeometry = BufferGeometryUtils.mergeGeometries(sphereGeoms);
  const position = cloudGeometry.attributes.position.array;
  const points: Vector3[] = [];
  for (let i = 0; i < position.length; i += 3) {
    points.push(new Vector3(position[i], position[i + 1], position[i + 2]));
  }
  const convexGeometry = new ConvexGeometry(points);

  atoms.forEach((atom, index) => {
    const { symbol, x, y, z } = atom;
    const elementData = periodicTable.getElementDataBySymbol(symbol);
    if (!elementData) return;
    const pos = scalePosition(x, y, z);
    atomPositions.push(pos.x, pos.y, pos.z);

    const partialCharge = atomPartialCharges[index] || 0;
    atomCharges.push(partialCharge);
    atomRadii.push(scaleRadius(elementData.radius.covalent));
    atomElectronegativities.push(elementData.electronegativity);
  });

  return (
    <MEP
      moleculeCenter={moleculeCenter}
      atomPositions={atomPositions}
      atomCharges={atomCharges}
      atomRadii={atomRadii}
      atomElectronegativities={atomElectronegativities}
      atomCount={atoms.length}
      geometry={convexGeometry}
    />
  );
}

interface MEPProps {
  moleculeCenter?: Vector3;
  atomPositions: number[];
  atomCharges: number[];
  atomRadii: number[];
  atomElectronegativities: number[];
  atomCount: number;
  geometry: BufferGeometry;
}

export function MEP({
  moleculeCenter = new Vector3(0, 0, 0),
  atomPositions,
  atomCharges,
  atomRadii,
  atomElectronegativities,
  atomCount,
  geometry,
}: MEPProps) {
  const [debug] = useAtom(debugAtom);

  const mesh = useMemo(() => {
    const material = new ShaderMaterial({
      wireframe: debug,
      uniforms: {
        moleculeCenter: {
          value: scalePosition(
            moleculeCenter.x,
            moleculeCenter.y,
            moleculeCenter.z
          ),
        },
        atomPositions: { value: atomPositions },
        atomCharges: { value: atomCharges },
        atomRadii: { value: atomRadii },
        atomElectronegativities: { value: atomElectronegativities },
        atomCount: { value: atomCount },
        potentialScale: { value: 50.0 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: true,
      depthWrite: true,
    });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(moleculeCenter.x, moleculeCenter.y, moleculeCenter.z);
    return mesh;
  }, [
    debug,
    moleculeCenter.x,
    moleculeCenter.y,
    moleculeCenter.z,
    atomPositions,
    atomCharges,
    atomRadii,
    atomElectronegativities,
    atomCount,
    geometry,
  ]);

  return <group>{mesh && <primitive object={mesh} />}</group>;
}
