import { useAtom } from "jotai";
import { periodicTableAtom } from "../state/app-state";
import { findContrastColor } from "color-contrast-finder";
import { useMemo } from "react";
import { ElementData } from "../constants/periodicTable";
import { PTableSymbol } from "periodic-table-data-complete";

function ElementCard({ elementData }: { elementData: ElementData }) {
  return (
    <div
      className="element"
      style={{
        backgroundColor: elementData?.color || "#ffffff",
        color: findContrastColor({
          color: elementData?.color || "#ffffff",
        }),
      }}
    >
      <div>{elementData?.atomic_number}</div>
      <div className="symbol">{elementData?.symbol}</div>
      <div>
        {elementData?.name}
        <br />
        {Math.round(elementData?.atomic_mass * 1000) / 1000}
      </div>
    </div>
  );
}

export function ElementCardList({ symbols }: { symbols: PTableSymbol[] }) {
  const [periodicTable] = useAtom(periodicTableAtom);
  const elementList = useMemo(() => {
    return symbols.map(
      // need to assert not undefined because we know the symbol is in the list
      (symbol) => periodicTable.getElementDataBySymbol(symbol)!
    );
  }, [periodicTable, symbols]);

  return (
    <div className="element-list">
      {elementList.map((ed) => (
        <ElementCard key={ed?.symbol} elementData={ed} />
      ))}
    </div>
  );
}
