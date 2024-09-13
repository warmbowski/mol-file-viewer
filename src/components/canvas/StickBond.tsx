import { useMemo } from "react";
import { useAtom } from "jotai";
import {
  CapsuleGeometry,
  LineCurve3,
  Mesh,
  Color,
  MeshStandardMaterial,
} from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { STICK_RADIUS, STICK_RADIUS_AROMATIC } from "@constants";
import { MoleculeAtom, glsl, scalePosition, scaleRadius } from "@utils";
import { debugAtom, noHAtom, periodicTableAtom } from "@state";

interface StickBondProps {
  atoms: MoleculeAtom[];
  atom1: number;
  atom2: number;
  bondType: number;
}

export function StickBond({ atoms, atom1, atom2, bondType }: StickBondProps) {
  const [noH] = useAtom(noHAtom);
  const [debug] = useAtom(debugAtom);
  const [periodicTable] = useAtom(periodicTableAtom);

  const stickBond = useMemo(() => {
    const { x: x1, y: y1, z: z1, symbol: symbol1 } = atoms[atom1 - 1];
    const { x: x2, y: y2, z: z2, symbol: symbol2 } = atoms[atom2 - 1];

    if (noH && (symbol1 === "H" || symbol2 === "H")) {
      return null;
    }

    const start = scalePosition(x1, y1, z1);
    const end = scalePosition(x2, y2, z2);
    const line = new LineCurve3(start, end);
    const distance = line.getLength();
    const radius = scaleRadius(
      bondType === 4 ? STICK_RADIUS_AROMATIC : STICK_RADIUS
    );
    const color1 = new Color(
      periodicTable.getElementDataBySymbol(symbol1)?.color
    );
    const color2 = new Color(
      periodicTable.getElementDataBySymbol(symbol2)?.color
    );

    /**
     * Not happy with adding bonds imperitively, but it works for now.
     * Couldn't figure out how to get rotation correct when using a
     * declarative Capsule from @rect-three/drei.
     * */

    /**
     * Mixed color extended MeshStandardMaterial from
     * https://codepen.io/prisoner849/pen/OJwqxBy
     */
    const bondMaterial = new MeshStandardMaterial({
      wireframe: debug,
      metalness: 0.5,
      roughness: 0.5,
      defines: { USE_UV: "" },
      userData: {
        uniforms: {
          color1: { value: color1 },
          color2: { value: color2 },
          colorRatio: { value: 0.5 },
        },
      },
    });
    bondMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.color1 = { value: color1 };
      shader.uniforms.color2 = { value: color2 };
      shader.uniforms.colorRatio = { value: 0.5 };
      shader.fragmentShader = glsl`
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float colorRatio;
        ${shader.fragmentShader}
      `.replace(
        glsl`#include <color_fragment>`,
        glsl`
        #include <color_fragment>
        diffuseColor.rgb = mix(color1, color2, step(colorRatio, vUv.y));
      `
      );
    };

    const bondCapsules = [...Array(bondType).keys()].map((idx) => {
      let translateX = 0;
      if (bondType === 2) {
        translateX = idx === 0 ? radius * 1.5 : -radius * 1.5;
      }
      if (bondType === 3) {
        translateX = idx === 1 ? radius * 2.5 : idx === 2 ? -radius * 2.5 : 0;
      }

      const geom = new CapsuleGeometry(radius, distance, 10, 10);
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
  }, [atom1, atom2, atoms, bondType, debug, noH, periodicTable]);

  return <group>{stickBond && <primitive object={stickBond} />}</group>;
}
