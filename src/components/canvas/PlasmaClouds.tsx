import { useAtom } from "jotai";
import { MoleculeAtom, scalePosition, scaleRadius } from "@utils";
import { periodicTableAtom, noHAtom } from "@state";
import { PlasmaCloud } from "./PlasmaCloud";

interface AtomicCloudsProps {
  atoms: MoleculeAtom[];
}

export function PlasmaClouds({ atoms }: AtomicCloudsProps) {
  const [periodicTable] = useAtom(periodicTableAtom);
  const [noH] = useAtom(noHAtom);

  return (
    <group name="cloud-atom">
      {atoms.map((atom) => {
        if (noH && atom.symbol === "H") return null;
        const elementData = periodicTable.getElementDataBySymbol(atom.symbol);
        if (!elementData) return null;

        const radius = scaleRadius(elementData.radius.covalent);
        const pos = scalePosition(atom.x, atom.y, atom.z);

        return (
          <PlasmaCloud
            key={atom.id}
            position={[pos.x, pos.y, pos.z]}
            radius={radius}
            color={elementData.color}
          />
        );
      })}
    </group>
  );
}
