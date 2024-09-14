import { useCallback } from "react";
import { useAtom } from "jotai";
import { button, useControls, Leva } from "leva";
import { useUploadMolecule } from "@api";
import {
  debugAtom,
  noHAtom,
  hideBallsAtom,
  hideSticksAtom,
  moleculeAtom,
  ballRadiusAtom,
  cloudTypeAtom,
  colorThemeAtom,
  canvasStateAtom,
} from "@state";
import { getDateTimeStamp, exportToSTL, exportGLTF } from "@utils";

export function ControlPanel() {
  const [debug, setDebug] = useAtom(debugAtom);
  const [noH, setNoH] = useAtom(noHAtom);
  const [hideBalls, setHideBalls] = useAtom(hideBallsAtom);
  const [hideSticks, setHideSticks] = useAtom(hideSticksAtom);
  const [cloudType, setCloudType] = useAtom(cloudTypeAtom);
  const [ballRadius, setBallRadius] = useAtom(ballRadiusAtom);
  const [colorTheme, setColorTheme] = useAtom(colorThemeAtom);
  const [molecule, setMolecule] = useAtom(moleculeAtom);
  const [canvasState] = useAtom(canvasStateAtom);

  const [, setOptions] = useControls(
    () => ({
      debug: { value: debug, label: "Debug", onChange: setDebug },
      theme: {
        value: colorTheme,
        label: "Color theme",
        options: {
          "Alt (Default)": 1,
          CPK: 0,
          Jmol: 2,
        },
        onChange: setColorTheme,
      },
      noH: { value: noH, label: "No H atoms", onChange: setNoH },
      hideBalls: {
        value: hideBalls,
        label: "Hide balls",
        onChange: setHideBalls,
      },
      hideSticks: {
        value: hideSticks,
        label: "Hide sticks",
        onChange: setHideSticks,
      },
      cloudType: {
        value: cloudType,
        label: "Cloud type",
        options: {
          None: "none",
          Atomic: "atomic",
          "Van der Waals": "vanderwaals",
          Shrinkwrap: "shrinkwrap",
        },
        onChange: setCloudType,
      },
      ballRadius: {
        value: ballRadius,
        label: "Ball radius",
        options: {
          Fixed: "fixed",
          "Atomic (Calc)": "calculated",
          "Atomic (Emper)": "empirical",
          Covalent: "covalent",
          "Van der Waals": "vanderwaals",
        },
        onChange: setBallRadius,
      },
      molecule: {
        value: molecule,
        label: "Pick molecule",
        options: {
          Ethane: "6324",
          Ethanol: "682",
          "Benzoic acid": "238",
          Caffiene: "2424",
          Catnip: "141747",
          Dichlorodiphenyldichloroethylene: "2927",
          "Silicon Compound": "CT1066647122",
          "Phosphazene Compound": "CT1083511253",
          custom: "custom",
        },
        onChange: setMolecule,
      },
      "Upload mol/sdf file": button(
        () => document.getElementById("file-input")?.click(),
        {
          disabled: false,
        }
      ),
      "Export model to stl": button(
        () => {
          if (canvasState) {
            const filename = `${molecule}-${getDateTimeStamp()}.stl`;
            const stl = exportToSTL(canvasState.scene);
            downloadBlob(stl, filename);
          }
        },
        {
          disabled: !canvasState,
        }
      ),
      "Export model to glb": button(
        () => {
          if (canvasState) {
            exportGLTF(canvasState.scene).then((gltfBuffer) => {
              let filename = `${molecule}-${getDateTimeStamp()}`;
              let blob: Blob;
              if (gltfBuffer instanceof ArrayBuffer) {
                blob = new Blob([gltfBuffer], {
                  type: "application/octet-stream",
                });
                filename += ".glb";
              } else {
                blob = new Blob([JSON.stringify(gltfBuffer, null, 2)], {
                  type: "text/plain",
                });
                filename += ".gltf";
              }
              downloadBlob(blob, filename);
            });
          }
        },
        {
          disabled: !canvasState,
        }
      ),
    }),
    [canvasState]
  );

  const uploadMolFile = useUploadMolecule();

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.item(0);
      if (!file) return;
      setOptions({ molecule: "custom" });
      await uploadMolFile.mutateAsync(file);
      // reset input for subsequent upload
      e.target.value = "";
    },
    [setOptions, uploadMolFile]
  );

  return (
    <>
      <Leva
        collapsed={window.innerWidth <= 768 ? true : false}
        titleBar={{ title: "Settings" }}
      />
      <input
        type="file"
        id="file-input"
        accept=".mol, .sdf"
        hidden
        onChange={handleFileSelect}
      />
    </>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
