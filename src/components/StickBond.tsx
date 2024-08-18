import { useMemo } from "react";
import {
  Vector3,
  CapsuleGeometry,
  LineCurve3,
  Mesh,
  ShaderMaterial,
  Color,
} from "three";
import { BondType, ELEMENT_DATA_MAP } from "../constants";
import { MoleculeAtom } from "../utils/readMolfile";
import { useAtom } from "jotai";
import { noHAtom } from "../state/app-state";

import vertexShader from "../shaders/stickBondColorVertex.glsl?raw";
import fragmentShader from "../shaders/stickBondColorFragment.glsl?raw";

interface StickBondProps {
  atoms: MoleculeAtom[];
  atom1: number;
  atom2: number;
  bondType: BondType;
}

export function StickBond({ atoms, atom1, atom2, bondType }: StickBondProps) {
  const [noH] = useAtom(noHAtom);

  const stick = useMemo(() => {
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
      bondType === BondType.AROMATIC ? bondType / 20 : bondType / 15;
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
    const capsuleMaterial = new ShaderMaterial({
      uniforms: {
        color1: { value: color1 },
        color2: { value: color2 },
        colorRatio: { value: 0.5 },
      },
      vertexShader,
      fragmentShader,
    });
    const capsuleGeometry = new CapsuleGeometry(radius, distance, 10, 20);
    capsuleGeometry.translate(0, distance / 2, 0);
    capsuleGeometry.rotateX(Math.PI / 2);

    const capsule = new Mesh(capsuleGeometry, capsuleMaterial);
    capsule.position.x = start.x;
    capsule.position.y = start.y;
    capsule.position.z = start.z;
    capsule.lookAt(end);

    return capsule;
  }, [atom1, atom2, atoms, bondType, noH]);

  return <group>{stick && <primitive object={stick} />}</group>;
}
