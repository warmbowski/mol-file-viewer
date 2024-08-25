import { useMemo } from "react";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import {
  DEFAULT_CLOUD_COLOR,
  ELEMENT_DATA_MAP,
  RadiusType,
} from "../constants";
import { MoleculeAtom } from "../utils/readMolfile";
import { Color, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from "three";

import fragmentShader from "../shaders/electronCloudAltFragment.glsl?raw";
import vertexShader from "../shaders/electronCloudVertex.glsl?raw";

interface VanDerWaalsCloudsProps {
  atoms: MoleculeAtom[];
}

export function VanDerWaalsClouds({ atoms }: VanDerWaalsCloudsProps) {
  const cloud = useMemo(() => {
    const sphereGeoms = atoms.map((atom) => {
      const elementData = ELEMENT_DATA_MAP.get(atom.symbol);
      const geom = new SphereGeometry(
        elementData?.radii[RadiusType.VanDerWaals],
        20,
        20
      );
      geom.translate(atom.x, atom.y, atom.z);
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

    return new Mesh(convexGeometry, cloudMaterial);
  }, [atoms]);

  return cloud && <primitive object={cloud} />;
}
