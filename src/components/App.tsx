import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { button, useControls } from "leva";
import { Molecule } from "./Molecule";
import { useUploadMolecule } from "../api/hooks/useUploadMolecule";
import { useCallback } from "react";

export interface AppOptions {
  debug: boolean;
  hideHydrogens: boolean;
  molecule: string;
}

export default function App() {
  const [options, setOptions] = useControls(() => ({
    debug: false,
    hideHydrogens: false,
    molecule: {
      value: "6324",
      options: {
        "ethane (6324)": "6324",
        "ethanol (682)": "682",
        "benzoic acid (238)": "238",
        "caffiene (2424)": "2424",
        "catnip (141747)": "141747",
        "dichlorodiphenyldichloroethylene (2927)": "2927",
        "?? (9683173)": "9683173",
        custom: "custom",
      },
    },
    upload: button(() => {
      document.getElementById("file-input")?.click();
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
        {options.debug && <axesHelper args={[5]} />}
        <OrbitControls />
        <ambientLight intensity={Math.PI} />
        <pointLight position={[10, 10, 10]} castShadow intensity={1000} />

        <Physics
          debug={options.debug}
          interpolate
          gravity={[0, -40, 0]}
          timeStep={1 / 60}
        >
          <Molecule options={options} />
        </Physics>
        <Environment background blur={0.75}>
          <color attach="background" args={["black"]} />
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
