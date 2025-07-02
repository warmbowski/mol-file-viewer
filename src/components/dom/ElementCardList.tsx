import { useAtom } from "jotai";
import { periodicTableAtom } from "@state";
import { findContrastColor } from "color-contrast-finder";
import { useMemo, useState } from "react";
import { ElementData } from "@constants";
import { PTableSymbol } from "periodic-table-data-complete";
import { Button, Drawer } from "@mantine/core";

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

export function ElementCardList({
  symbols,
  rawData,
}: {
  symbols: PTableSymbol[];
  rawData: string;
}) {
  const [periodicTable] = useAtom(periodicTableAtom);
  const [showRawData, setShowRawData] = useState(false);
  const elementList = useMemo(() => {
    return symbols.map(
      // need to assert not undefined because we know the symbol is in the list
      (symbol) => periodicTable.getElementDataBySymbol(symbol)!
    );
  }, [periodicTable, symbols]);

  return (
    <>
      <div className="element-list">
        <Button
          variant="light"
          size="compact-xs"
          key="raw-data"
          onClick={() => setShowRawData(true)}
        >
          Raw Data
        </Button>
        {elementList
          .sort((a, b) => a.atomic_number - b.atomic_number)
          .map((ele) => (
            <ElementCard key={ele?.symbol} elementData={ele} />
          ))}
      </div>
      <Drawer
        opened={showRawData}
        onClose={() => setShowRawData(false)}
        title="Raw Data"
        size={"xl"}
        position="left"
      >
        <pre>{rawData}</pre>
      </Drawer>
    </>
  );
}
