import {
  BufferGeometryJSON,
  BufferGeometryLoader,
  ShaderMaterialJSON,
  MaterialLoader,
  MeshJSON,
} from "three";
import { ADDITION, Brush, Evaluator } from "three-bvh-csg";

export interface BrushData {
  materialJson: ShaderMaterialJSON;
  geometryJson: BufferGeometryJSON;
}

export function cgsBrushCalcs(brushData: BrushData[]): MeshJSON | undefined {
  const evaluator = new Evaluator();
  const bufferLoader = new BufferGeometryLoader();
  const materialLoader = new MaterialLoader();
  const postMessage = self.postMessage;

  const brushes = brushData.map(({ geometryJson, materialJson }) => {
    const material = materialLoader.parse(materialJson);
    const geometry = bufferLoader.parse(geometryJson);
    return new Brush(geometry, material);
  });

  const newBrush = brushes.reduce<Brush | undefined>((acc, brush, index) => {
    postMessage({
      type: "PROGRESS",
      progress: (index / brushData.length) * 95,
    });
    if (acc === undefined) {
      return new Brush(brush.geometry, brush.material);
    }
    return evaluator.evaluate(acc, brush, ADDITION);
  }, undefined);

  return newBrush?.toJSON();
}
