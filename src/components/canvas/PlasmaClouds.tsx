import { useAtom } from "jotai";
import { MoleculeAtom, scalePosition, scaleRadius } from "@utils";
import { periodicTableAtom, noHAtom } from "@state";
import { PlasmaCloud } from "./PlasmaCloud";

interface AtomicCloudsProps {
  atoms: MoleculeAtom[];
}

// deterministic hash -> [0,1) for stable per-atom seed
function hashStringTo01(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  }
  // map to [0,1)
  return (h % 10000) / 10000;
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
        const seed = hashStringTo01(
          String(atom.id ?? `${atom.x}-${atom.y}-${atom.z}-${atom.symbol}`)
        );

        return (
          <PlasmaCloud
            key={atom.id}
            position={[pos.x, pos.y, pos.z]}
            radius={radius}
            color={elementData.color}
            seed={seed}
          />
        );
      })}
    </group>
  );
}
