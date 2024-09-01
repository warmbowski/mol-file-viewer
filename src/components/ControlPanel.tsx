import { useCallback } from "react";
import { useAtom } from "jotai";
import { button, useControls, Leva } from "leva";
import { PTableSymbol } from "periodic-table-data-complete";
import { useUploadMolecule } from "../api/hooks/useUploadMolecule";
import {
  debugAtom,
  noHAtom,
  hideBallsAtom,
  hideSticksAtom,
  moleculeAtom,
  ballRadiusAtom,
  cloudTypeAtom,
  colorThemeAtom,
  processingWorkerAtom,
} from "../state/app-state";
import { ElementCardList } from "./ElementCardList";

// import ghLogo from "../assets/github-mark-white.svg";

export function ControlPanel({ symbols }: { symbols: PTableSymbol[] }) {
  const [debug, setDebug] = useAtom(debugAtom);
  const [noH, setNoH] = useAtom(noHAtom);
  const [hideBalls, setHideBalls] = useAtom(hideBallsAtom);
  const [hideSticks, setHideSticks] = useAtom(hideSticksAtom);
  const [cloudType, setCloudType] = useAtom(cloudTypeAtom);
  const [ballRadius, setBallRadius] = useAtom(ballRadiusAtom);
  const [colorTheme, setColorTheme] = useAtom(colorThemeAtom);
  const [molecule, setMolecule] = useAtom(moleculeAtom);
  const [processing] = useAtom(processingWorkerAtom);

  const [, setOptions] = useControls(() => ({
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
        "Ethane (6324)": "6324",
        "Ethanol (682)": "682",
        "Benzoic acid (238)": "238",
        "Caffiene (2424)": "2424",
        "Catnip (141747)": "141747",
        "Dichlorodiphenyldichloroethylene (2927)": "2927",
        "Silicon Compound (64-17-5)": "64-17-5",
        "Phosphazene Compound (C60H42N3O6P3)": "C60H42N3O6P3",
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
  }));

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
      <Leva collapsed={window.innerWidth <= 768 ? true : false} />
      <ElementCardList symbols={symbols} />
      <input
        type="file"
        id="file-input"
        accept=".mol, .sdf"
        hidden
        onChange={handleFileSelect}
      />
      {processing && (
        <div className="processing">
          <p>Calculating Van der Waals cloud...</p>
        </div>
      )}
      {/* <div className="repo-link">
        <img src={ghLogo} alt="GitHub logo" style={{ height: "1.5em" }} />
        <a
          href="https://github.com/warmbowski/mol-file-viewer"
          target="_blank"
          rel="noreferrer"
        >
          Mol File Viewer repository
        </a>
      </div> */}
    </>
  );
}
