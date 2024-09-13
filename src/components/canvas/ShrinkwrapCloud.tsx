import { useMemo } from "react";
import { useAtom } from "jotai";
import { Color, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { DEFAULT_CLOUD_COLOR } from "@constants";
import { MoleculeAtom, scalePosition, scaleRadius } from "@utils";
import { periodicTableAtom } from "@state";

import fragmentShader from "@/src/assets/shaders/electronCloudAltFragment.glsl?raw";
import vertexShader from "@/src/assets/shaders/electronCloudVertex.glsl?raw";

interface VanDerWaalsCloudsProps {
  atoms: MoleculeAtom[];
}

export function ShrinkWrapCloud({ atoms }: VanDerWaalsCloudsProps) {
  const [periodicTable] = useAtom(periodicTableAtom);

  const cloud = useMemo(() => {
    const sphereGeoms = atoms.map((atom) => {
      const elementData = periodicTable.getElementDataBySymbol(atom.symbol);
      const radius = scaleRadius(elementData?.radius.vanderwaals);
      const geom = new SphereGeometry(radius, 20, 20);
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

    const cloudMaterial = new ShaderMaterial({
      uniforms: {
        color: { value: new Color(DEFAULT_CLOUD_COLOR) },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: true,
      depthWrite: true,
    });

    const mesh = new Mesh(convexGeometry, cloudMaterial);
    mesh.scale.set(1.01, 1.01, 1.01);
    return mesh;
  }, [atoms, periodicTable]);

  return <group name="cloud-sw">{cloud && <primitive object={cloud} />}</group>;
}
