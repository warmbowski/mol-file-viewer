import { useAtom } from "jotai";
import { AppShell } from "@mantine/core";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  debugAtom,
  SelectedMolecule,
  selectedMoleculeAtom,
  selectedMoleculeSchema,
} from "@state";
import {
  FOOTER_HEIGHT,
  FOV,
  INIT_CAMERA_Z,
  UPLOAD_MOLECULE_PLACEHOLDER,
} from "@constants";
import { Molecule, Progress } from "./canvas";
import { Dom, FooterBar } from "./dom";
import { useGetConformerMolecule } from "@api";
import { useEffect } from "react";

export default function App() {
  const [debug] = useAtom(debugAtom);
  const [selectedMolecule, setSelectedMolecule] = useAtom(selectedMoleculeAtom);

  const { data: molecule, isFetching } = useGetConformerMolecule(
    selectedMolecule?.text || "",
    "name"
  );

  useEffect(() => {
    if (
      selectedMolecule &&
      selectedMolecule.text !== UPLOAD_MOLECULE_PLACEHOLDER
    ) {
      const newUrl = `${window.location.pathname}?${new URLSearchParams(
        selectedMolecule
      ).toString()}`;
      window.history.pushState({}, "", newUrl);
    } else {
      const newUrl = `${window.location.pathname}`;
      window.history.pushState({}, "", newUrl);
    }
  }, [selectedMolecule]);

  useEffect(() => {
    const initialMolecule = initSelectedMolecule();
    console.log(initialMolecule);
    if (initialMolecule) {
      setSelectedMolecule(initialMolecule);
    }
  }, [setSelectedMolecule]);

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

const initSelectedMolecule = (): SelectedMolecule | null => {
  try {
    return (
      selectedMoleculeSchema.parse(
        Object.fromEntries(new URLSearchParams(window.location.search))
      ) || null
    );
  } catch {
    return null;
  }
};
