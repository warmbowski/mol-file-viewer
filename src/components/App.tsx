import { useMemo } from "react";
import { useAtom } from "jotai";
import { Environment, OrbitControls, Progress, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Molecule } from "./Molecule";
import { debugAtom, moleculeAtom } from "../state/app-state";
import { ControlPanel } from "./ControlPanel";
import { useGetMolecule } from "../api/hooks/useGetMolecule";

export default function App() {
  const [debug] = useAtom(debugAtom);
  const [molecule] = useAtom(moleculeAtom);
  const { data, error, isFetching } = useGetMolecule(molecule);

  const symbols = useMemo(() => {
    return new Set(data?.atoms.map((atom) => atom.symbol));
  }, [data]);

  return (
    <>
      <Canvas camera={{ position: [0, 0, 13], fov: 25, near: 0.1, far: 250 }}>
        {debug && <axesHelper args={[5]} />}
        <OrbitControls />
        <ambientLight intensity={Math.PI} />
        <pointLight position={[10, 10, 10]} castShadow intensity={1000} />
        {!isFetching && data ? <Molecule molecule={data} /> : <Progress />}
        {error && <Text color="red">Error loading molecule</Text>}
        <Environment background blur={0.75}>
          <color attach="background" args={[0x333533]} />
        </Environment>
      </Canvas>
      <ControlPanel symbols={[...symbols]} />
    </>
  );
}
