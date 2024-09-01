import { useAtom } from "jotai";
import { periodicTableAtom } from "../state/app-state";
import { findContrastColor } from "color-contrast-finder";

function ElementCard({ symbol }: { symbol: string }) {
  const [periodicTable] = useAtom(periodicTableAtom);
  const elementData = periodicTable.getElementDataBySymbol(symbol);

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
      <div className="at_num">{elementData?.atomic_number}</div>
      <div className="symbol">{elementData?.symbol}</div>
      <div className="at_details">
        {elementData?.name}
        <br />
        {elementData?.atomic_mass}
      </div>
    </div>
  );
}

export function ElementCardList({ symbols }: { symbols: string[] }) {
  return (
    <div className="element-list">
      {symbols.map((symbol) => (
        <ElementCard key={symbol} symbol={symbol} />
      ))}
    </div>
  );
}
