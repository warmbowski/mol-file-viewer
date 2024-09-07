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
  colorThemeAtom,
  debugAtom,
  periodicTableAtom,
  processingWorkerAtom,
} from "../state/app-state";
import { makeCsgBrushWorker } from "../utils/workers/cgsBrushWorker";
import { BrushData } from "../utils/workers/cgsBrushCalcs";
import { scalePosition, scaleRadius } from "../utils/scaleModelData";

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
  const [theme] = useAtom(colorThemeAtom);
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
          scaleRadius(elementData?.radius.vanderwaals),
          24,
          24
        );
        const position = scalePosition(atom.x, atom.y, atom.z);
        geometry.translate(position.x, position.y, position.z);

        return {
          materialJson: material.toJSON(),
          geometryJson: geometry.toNonIndexed().toJSON(),
        };
      }),
    [atoms, debug, periodicTable]
  );

  const { data: csgJson, isFetching } = useQuery({
    queryKey: ["calculate-vanderwaal-cloud", theme, cacheKey],
    queryFn: () =>
      makeCsgBrushWorker({
        onMessage: (evt) => {
          if (evt.data.type === "PROGRESS") {
            setProcessing(evt.data.progress || 0.1);
          } else if (evt.data.type === "RAW") {
            setProcessing(100);
          }
        },
      }).cgsBrushCalcs(brushData),
    staleTime: Infinity,
  });

  const cloudMesh = useMemo(() => {
    if (!csgJson) {
      return undefined;
    }
    return meshLoader.parse(csgJson) as Mesh;
  }, [csgJson]);

  useEffect(() => {
    if (csgJson && !isFetching) {
      setTimeout(() => {
        setProcessing(0);
      }, 1000);
    }
    return () => setProcessing(0);
  }, [csgJson, isFetching, setProcessing]);

  return (
    <group name="cloud-vdw">
      {cloudMesh && <primitive object={cloudMesh} />}
    </group>
  );
}
