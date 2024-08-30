import { useAtom } from "jotai";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Molecule } from "./Molecule";
import { debugAtom } from "../state/app-state";
import { ControlPanel } from "./ControlPanel";

export default function App() {
  const [debug] = useAtom(debugAtom);

  return (
    <>
      <Canvas camera={{ position: [0, 0, 13], fov: 25, near: 0.1, far: 250 }}>
        {debug && <axesHelper args={[5]} />}
        <OrbitControls />
        <ambientLight intensity={Math.PI} />
        <pointLight position={[10, 10, 10]} castShadow intensity={1000} />
        <Molecule />
        <Environment background blur={0.75}>
          <color attach="background" args={[0x333533]} />
        </Environment>
      </Canvas>
      <ControlPanel />
    </>
  );
}
