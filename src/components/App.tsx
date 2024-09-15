import { useAtom } from "jotai";
import { AppShell } from "@mantine/core";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { debugAtom, pubChemMoleculeAtom } from "@state";
import { FOOTER_HEIGHT, FOV, INIT_CAMERA_Z } from "@constants";
import { Molecule, Progress } from "./canvas";
import { Dom, FooterBar } from "./dom";
import { useGetConformerMolecule } from "@api";

export default function App() {
  const [debug] = useAtom(debugAtom);
  const [moleculeName] = useAtom(pubChemMoleculeAtom);

  const { data: molecule, isFetching } = useGetConformerMolecule(
    moleculeName?.text || "",
    "name"
  );

  return (
    <AppShell footer={{ height: FOOTER_HEIGHT }}>
      <AppShell.Main h={`calc(100% - ${FOOTER_HEIGHT}px)`} pos="relative">
        <Canvas
          style={{ position: "absolute" }}
          camera={{
            position: [0, 0, INIT_CAMERA_Z],
            fov: FOV,
            near: 0.1,
            far: 3000,
          }}
        >
          {debug && <axesHelper args={[10]} />}
          <OrbitControls />
          <ambientLight intensity={Math.PI} />
          <pointLight position={[0, -70, 70]} intensity={5000} />
          <pointLight position={[0, 70, -70]} intensity={5000} />
          {isFetching ? (
            <Progress />
          ) : (
            molecule && <Molecule molecule={molecule} />
          )}
          <Environment background blur={0.75}>
            <color attach="background" args={[0x333533]} />
          </Environment>
        </Canvas>
        <Dom />
      </AppShell.Main>
      <AppShell.Footer>
        <FooterBar />
      </AppShell.Footer>
    </AppShell>
  );
}
