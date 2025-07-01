import { useMemo } from "react";
import { useAtom } from "jotai";
import { Mesh, ShaderMaterial, SphereGeometry, Vector3 } from "three";
import { debugAtom, periodicTableAtom } from "@state";

import fragmentShader from "@assets/shaders/mepFragment.glsl?raw";
import vertexShader from "@assets/shaders/mepVertex.glsl?raw";
import { MoleculeAtom, scalePosition, scaleRadius } from "@utils";

interface MepCloudProps {
  atoms: MoleculeAtom[];
}

export function MEPCloud({ atoms }: MepCloudProps) {
  const [periodicTable] = useAtom(periodicTableAtom);
  // iterate over the atom and create a mesh of MEP spheres for each atom
  const meshes = atoms.map((atom) => {
    const { symbol, x, y, z } = atom;
    const elementData = periodicTable.getElementDataBySymbol(symbol);
    if (!elementData) {
      console.warn(`Element data not found for symbol: ${symbol}`);
      return null;
    }

    const position = scalePosition(x, y, z);
    return (
      <MEP
        key={atom.id}
        charge={0} // MEP charge is not defined in the atom, set to 0
        radius={scaleRadius(elementData.radius.covalent)}
        position={position}
        electronegativity={elementData.electronegativity}
      />
    );
  });

  return <group>{meshes}</group>;
}

interface MEPProps {
  radius: number;
  charge: number;
  electronegativity: number;
  position: Vector3;
}

export function MEP({ charge, radius, position, electronegativity }: MEPProps) {
  const [debug] = useAtom(debugAtom);

  const mesh = useMemo(() => {
    const geometry = new SphereGeometry(radius, 75, 75);
    const material = new ShaderMaterial({
      wireframe: debug,
      uniforms: {
        molecularCenter: { value: new Vector3(0, 0, 0) },
        atomPosition: { value: position },
        atomCharge: { value: charge },
        atomRadius: { value: radius },
        potentialScale: { value: 1 },
        electronegativity: { value: electronegativity },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthTest: true,
      depthWrite: true,
    });

    const mesh = new Mesh(geometry, material);
    if (position) {
      const [x, y, z] = position;
      mesh.position.set(x, y, z);
    }

    return mesh;
  }, [charge, debug, electronegativity, position, radius]);

  return <group>{mesh && <primitive object={mesh} />}</group>;
}
