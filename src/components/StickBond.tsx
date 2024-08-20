import { useMemo } from "react";
import {
  Vector3,
  CapsuleGeometry,
  LineCurve3,
  Mesh,
  ShaderMaterial,
  Color,
} from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { RadiusType, ELEMENT_DATA_MAP, STICK_RADIUS } from "../constants";
import { MoleculeAtom } from "../utils/readMolfile";
import { useAtom } from "jotai";
import { noHAtom } from "../state/app-state";

import vertexShader from "../shaders/stickBondColorVertex.glsl?raw";
import fragmentShader from "../shaders/stickBondColorFragment.glsl?raw";

interface StickBondProps {
  atoms: MoleculeAtom[];
  atom1: number;
  atom2: number;
  bondType: RadiusType;
}

export function StickBond({ atoms, atom1, atom2, bondType }: StickBondProps) {
  const [noH] = useAtom(noHAtom);

  const stickBond = useMemo(() => {
    const { x: x1, y: y1, z: z1, symbol: symbol1 } = atoms[atom1 - 1];
    const { x: x2, y: y2, z: z2, symbol: symbol2 } = atoms[atom2 - 1];

    if (noH && (symbol1 === "H" || symbol2 === "H")) {
      return null;
    }

    const start = new Vector3(x1, y1, z1);
    const end = new Vector3(x2, y2, z2);
    const line = new LineCurve3(start, end);
    const distance = line.getLength();
    const radius =
      bondType === RadiusType.Aromatic ? bondType / 20 : STICK_RADIUS;
    const color1 = new Color(ELEMENT_DATA_MAP.get(symbol1)?.color || 0xffffff);
    const color2 = new Color(ELEMENT_DATA_MAP.get(symbol2)?.color || 0xffffff);

    /**
     * Not happy with adding bonds imperitively, but it works for now.
     * Couldn't figure out how to get rotation correct when using a
     * declarative Capsule from @rect-three/drei.
     * */

    /**
     * Mixed color ShaderMaterial from
     * https://stackoverflow.com/questions/68552141/three-js-shapes-with-more-than-one-color
     */
    const bondMaterial = new ShaderMaterial({
      uniforms: {
        color1: { value: color1 },
        color2: { value: color2 },
        colorRatio: { value: 0.5 },
      },
      vertexShader,
      fragmentShader,
    });

    const bondCapsules = [...Array(bondType).keys()].map((idx) => {
      let translateX = 0;
      if (bondType === RadiusType.CovalentDouble) {
        translateX = idx === 0 ? radius * 1.5 : -radius * 1.5;
      }
      if (bondType === RadiusType.CovalentTriple) {
        translateX = idx === 1 ? radius * 2.5 : idx === 2 ? -radius * 2.5 : 0;
      }

      const geom = new CapsuleGeometry(radius, distance, 10, 20);
      geom.translate(translateX, distance / 2, 0).rotateX(Math.PI / 2);
      return geom;
    });

    const bondGeometry = BufferGeometryUtils.mergeGeometries(bondCapsules);

    const capsule = new Mesh(bondGeometry, bondMaterial);

    capsule.position.x = start.x;
    capsule.position.y = start.y;
    capsule.position.z = start.z;
    capsule.lookAt(end);

    return capsule;
  }, [atom1, atom2, atoms, bondType, noH]);

  return <group>{stickBond && <primitive object={stickBond} />}</group>;
}
