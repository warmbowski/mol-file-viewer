import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useControls } from "leva";
import { Molecule } from "./Molecule";
import { useEffect, useState } from "react";
import { MolObj, readMolFile } from "../utils/readMolfile";

export default function App() {
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
  });
  const [molObj, setMolObj] = useState<MolObj>();

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
  );
}
