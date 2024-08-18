import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { button, useControls } from "leva";
import { Molecule } from "./Molecule";
import { useUploadMolecule } from "../api/hooks/useUploadMolecule";
import { useCallback } from "react";
import { useAtom } from "jotai";
import {
  debugAtom,
  noHAtom,
  hideBallsAtom,
  hideSticksAtom,
  hideCloudsAtom,
  moleculeAtom,
  ballRadiusAtom,
} from "../state/app-state";

export default function App() {
  const [debug, setDebug] = useAtom(debugAtom);
  const [, setNoH] = useAtom(noHAtom);
  const [, setHideBalls] = useAtom(hideBallsAtom);
  const [, setHideSticks] = useAtom(hideSticksAtom);
  const [, setHideClouds] = useAtom(hideCloudsAtom);
  const [, setBallRadius] = useAtom(ballRadiusAtom);
  const [, setMolecule] = useAtom(moleculeAtom);

  const [, setOptions] = useControls(() => ({
    debug: { value: false, onChange: setDebug },
    noH: { value: false, label: "No H atoms", onChange: setNoH },
    hideBalls: { value: false, label: "Hide balls", onChange: setHideBalls },
    hideSticks: { value: false, label: "Hide sticks", onChange: setHideSticks },
    hideClouds: { value: false, label: "Hide clouds", onChange: setHideClouds },
    ballRadius: {
      value: 0,
      label: "Ball radius",
      options: {
        Atomic: 0,
        Covalent: 1,
        "Van der Waals": 5,
      },
      onChange: setBallRadius,
    },
    molecule: {
      value: "6324",
      label: "Pick molecule",
      options: {
        "Ethane (6324)": "6324",
        "Ethanol (682)": "682",
        "Benzoic acid (238)": "238",
        "Caffiene (2424)": "2424",
        "Catnip (141747)": "141747",
        "Dichlorodiphenyldichloroethylene (2927)": "2927",
        "?? (9683173)": "9683173",
        custom: "custom",
      },
      onChange: setMolecule,
    },
    upload: button(() => document.getElementById("file-input")?.click(), {
      disabled: false,
    }),
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
      <Canvas camera={{ position: [0, 0, 13], fov: 25 }}>
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
