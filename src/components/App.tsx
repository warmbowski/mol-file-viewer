import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { button, useControls } from "leva";
import { Molecule } from "./Molecule";
import { useEffect, useState } from "react";
import { MolObj, readMolFile } from "../utils/readMolfile";

export default function App() {
  const [molObj, setMolObj] = useState<MolObj>();
  const { debug, compound } = useControls({
    debug: false,
    compound: {
      value: "6324",
      options: {
        "ethane (6324)": "6324",
        "ethanol (682)": "682",
        "benzoic acid (238)": "238",
        "caffiene (2424)": "2424",
        "catnip (141747)": "141747",
        "dichlorodiphenyldichloroethylene (2927)": "2927",
        "?? (9683173)": "9683173",
      },
    },
    upload: button(() => {
      document.getElementById("file-input")?.click();
    }),
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    const molFile = await file.text();
    const molObj = readMolFile(molFile);
    setMolObj(molObj);
    e.target.value = "";
  };

  useEffect(() => {
    async function getMolecule(CSID: string) {
      const resp = await fetch("molecules/" + CSID + ".mol");
      const molFile = await resp.text();
      const molObj = readMolFile(molFile);
      setMolObj(molObj);
    }
    try {
      getMolecule(compound || "ethanol");
    } catch (err) {
      console.error(err);
    }
  }, [compound]);

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
          {molObj && <Molecule {...molObj} />}
        </Physics>
        <Environment background blur={0.75}>
          <color attach="background" args={["black"]} />
        </Environment>
      </Canvas>
      <input type="file" id="file-input" hidden onChange={handleFileSelect} />
    </>
  );
}
