import { Object3D } from "three";
import { STLExporter, STLExporterOptions } from "three/examples/jsm/Addons.js";

export interface ExportToSTL {
  scene: Object3D;
}

export const exportToSTL = (scene: Object3D) => {
  const options: STLExporterOptions = {
    binary: true,
  };
  const copyScene = scene.clone();
  // scale the scene to 10x so it's easier to see in the slicer software
  copyScene.scale.set(10, 10, 10);

  const stl = new STLExporter().parse(copyScene, options);
  return new Blob([stl], { type: "text/plain" });
};
