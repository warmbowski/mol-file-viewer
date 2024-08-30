/**
 * Constructive Solid Geometry (CSG) representation of the electron cloud
 * based on https://github.com/gkjohnson/three-bvh-csg/blob/main/examples/multimaterial.js
 */
import { useMemo } from "react";
import { useAtom } from "jotai";
import { Color, ShaderMaterial, SphereGeometry } from "three";
import { ADDITION, Brush, Evaluator } from "three-bvh-csg";
import { MoleculeAtom } from "../utils/readMolfile";
import { debugAtom, periodicTableAtom } from "../state/app-state";

import fragmentShader from "../shaders/electronCloudAltFragment.glsl?raw";
import vertexShader from "../shaders/electronCloudVertex.glsl?raw";

interface VanDerWaalsCloudsProps {
  atoms: MoleculeAtom[];
}

export function VanDerWaalsClouds({ atoms }: VanDerWaalsCloudsProps) {
  const [periodicTable] = useAtom(periodicTableAtom);
  const [debug] = useAtom(debugAtom);

  const brushes = useMemo(
    () =>
      atoms.map((atom) => {
        const elementData = periodicTable.getElementDataBySymbol(atom.symbol);

        const material = new ShaderMaterial({
          wireframe: debug,
          uniforms: {
            color: { value: new Color(elementData?.color) },
          },
          vertexShader: vertexShader,
          fragmentShader: fragmentShader,
          transparent: true,
          depthTest: true,
          depthWrite: true,
        });

        const geometry = new SphereGeometry(
          elementData?.radius.vanderwaals,
          24,
          24
        );
        geometry.translate(atom.x, atom.y, atom.z);

        return new Brush(geometry, material);
      }),
    [atoms, debug, periodicTable]
  );

  const combined = useMemo(() => {
    const evaluator = new Evaluator();
    return brushes.reduce<Brush | undefined>((acc, brush) => {
      if (acc === undefined) {
        return brush;
      }
      return evaluator.evaluate(acc, brush, ADDITION);
    }, undefined);
  }, [brushes]);

  return <group>{combined && <primitive object={combined} />}</group>;
}
