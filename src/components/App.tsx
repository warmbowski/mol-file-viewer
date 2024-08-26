import { useCallback } from "react";
import { useAtom } from "jotai";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { button, useControls, Leva } from "leva";
import { Molecule } from "./Molecule";
import { useUploadMolecule } from "../api/hooks/useUploadMolecule";
import {
  debugAtom,
  noHAtom,
  hideBallsAtom,
  hideSticksAtom,
  moleculeAtom,
  ballRadiusAtom,
  dropElementsAtom,
  cloudTypeAtom,
} from "../state/app-state";

import ghLogo from "../assets/github-mark-white.svg";

export default function App() {
  const [debug, setDebug] = useAtom(debugAtom);
  const [noH, setNoH] = useAtom(noHAtom);
  const [hideBalls, setHideBalls] = useAtom(hideBallsAtom);
  const [hideSticks, setHideSticks] = useAtom(hideSticksAtom);
  const [cloudType, setCloudType] = useAtom(cloudTypeAtom);
  const [ballRadius, setBallRadius] = useAtom(ballRadiusAtom);
  const [molecule, setMolecule] = useAtom(moleculeAtom);
  const [doNotUse, setDoNotUse] = useAtom(dropElementsAtom);

  const [, setOptions] = useControls(() => ({
    debug: { value: debug, label: "Debug", onChange: setDebug },
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
    upload: button(() => document.getElementById("file-input")?.click(), {
      disabled: false,
    }),
    doNotUse: {
      value: doNotUse,
      label: "Do not use",
      onChange: setDoNotUse,
      // disabled: true,
    },
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
      <Canvas camera={{ position: [0, 0, 13], fov: 25, near: 0.1, far: 250 }}>
        {debug && <axesHelper args={[5]} />}
        <OrbitControls />
        <ambientLight intensity={Math.PI} />
        <pointLight position={[10, 10, 10]} castShadow intensity={1000} />

        <Physics
          debug={debug}
          interpolate
          gravity={[0, -40, 0]}
          timeStep={1 / 60}
        >
          <Molecule />
        </Physics>
        <Environment background blur={0.75}>
          <color attach="background" args={[0x333533]} />
        </Environment>
      </Canvas>
      <Leva collapsed={window.innerWidth <= 768 ? true : false} />
      <div className="repo-link">
        <img src={ghLogo} alt="GitHub logo" style={{ height: "1.5em" }} />
        <a
          href="https://github.com/warmbowski/mol-file-viewer"
          target="_blank"
          rel="noreferrer"
        >
          Mol File Viewer repository
        </a>
      </div>
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
