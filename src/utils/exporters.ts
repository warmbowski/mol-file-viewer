import { Object3D } from "three";
import {
  GLTFExporter,
  GLTFExporterOptions,
  STLExporter,
  STLExporterOptions,
} from "three/examples/jsm/Addons.js";

export interface ExportToSTL {
  scene: Object3D;
}

export const exportToSTL = (scene: Object3D) => {
  const options: STLExporterOptions = {
    binary: true,
  };
  const copyScene = scene.clone();

  filterOutClouds(copyScene);

  const stl = new STLExporter().parse(copyScene, options);
  return new Blob([stl], { type: "text/plain" });
};

export const exportGLTF = (scene: Object3D) => {
  const options: GLTFExporterOptions = {
    binary: false,
  };
  const copyScene = scene.clone();

  filterOutClouds(copyScene);

  return new GLTFExporter().parseAsync(copyScene, options);
};

const filterOutClouds = (scene: Object3D) => {
  scene.traverse((child) => {
    if (child.name.startsWith("cloud")) {
      const parent = child.parent;
      parent?.remove(child);
    }
  });
};
