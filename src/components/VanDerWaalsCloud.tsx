/**
 * Constructive Solid Geometry (CSG) representation of the electron cloud
 * based on https://github.com/gkjohnson/three-bvh-csg/blob/main/examples/multimaterial.js
 */
import { useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import {
  Color,
  Mesh,
  ObjectLoader,
  ShaderMaterial,
  SphereGeometry,
} from "three";
import { useQuery } from "@tanstack/react-query";
import { MoleculeAtom } from "../utils/readMolfile";
import {
  debugAtom,
  periodicTableAtom,
  processingWorkerAtom,
} from "../state/app-state";
import { csgBrushWorker } from "../utils/workers/cgsBrushWorker";
import { BrushData } from "../utils/workers/cgsBrushCalcs";

import fragmentShader from "../shaders/electronCloudAltFragment.glsl?raw";
import vertexShader from "../shaders/electronCloudVertex.glsl?raw";

const meshLoader = new ObjectLoader();

interface VanDerWaalsCloudsProps {
  atoms: MoleculeAtom[];
  cacheKey?: string;
}

export function VanDerWaalsClouds({ atoms, cacheKey }: VanDerWaalsCloudsProps) {
  const [periodicTable] = useAtom(periodicTableAtom);
  const [debug] = useAtom(debugAtom);
  const [, setProcessing] = useAtom(processingWorkerAtom);

  const brushData: BrushData[] = useMemo(
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

        return {
          materialJson: material.toJSON(),
          geometryJson: geometry.toNonIndexed().toJSON(),
        };
      }),
    [atoms, debug, periodicTable]
  );

  const { data: csgJson, isFetching } = useQuery({
    queryKey: ["calculate-vanderwaal-cloud", cacheKey],
    queryFn: () => csgBrushWorker.cgsBrushCalcs(brushData),
    staleTime: Infinity,
  });

  const cloudMesh = useMemo(() => {
    if (!csgJson) {
      return undefined;
    }
    return meshLoader.parse(csgJson) as Mesh;
  }, [csgJson]);

  useEffect(() => {
    setProcessing(isFetching);
  }, [isFetching, setProcessing]);

  return <group>{cloudMesh && <primitive object={cloudMesh} />}</group>;
}
