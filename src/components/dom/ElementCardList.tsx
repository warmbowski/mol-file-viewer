import { useAtom } from "jotai";
import { periodicTableAtom } from "@state";
import { findContrastColor } from "color-contrast-finder";
import { useMemo, useState } from "react";
import { ElementData } from "@constants";
import { PTableSymbol } from "periodic-table-data-complete";
import { Button, Drawer, UnstyledButton } from "@mantine/core";

function ElementCard({
  elementData,
  onClick,
}: {
  elementData: ElementData;
  onClick: (elSymbol: PTableSymbol) => void;
}) {
  return (
    <UnstyledButton
      className={`element ${elementData?.symbol}`}
      style={{
        backgroundColor: elementData?.color || "#ffffff",
        color: findContrastColor({
          color: elementData?.color || "#ffffff",
        }),
      }}
      size={"xs"}
      title={`${elementData?.name} (${elementData?.symbol})`}
      onClick={() => onClick(elementData?.symbol)}
    >
      <div>{elementData?.atomic_number}</div>
      <div className="symbol">{elementData?.symbol}</div>
      <div>
        {elementData?.name}
        <br />
        {Math.round(elementData?.atomic_mass * 1000) / 1000}
      </div>
    </UnstyledButton>
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
  const [showElementData, setShowElementData] = useState<PTableSymbol | null>(
    null
  );
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
          .sort((a, b) => {
            if (a.atomic_number === 6) return -1;
            if (b.atomic_number === 6) return 1;
            return a.atomic_number - b.atomic_number;
          })
          .map((elem) => (
            <ElementCard
              onClick={(symbol) => setShowElementData(symbol)}
              key={elem?.symbol}
              elementData={elem}
            />
          ))}
      </div>
      <Drawer
        opened={showRawData || showElementData !== null}
        onClose={() => {
          setShowRawData(false);
          setShowElementData(null);
        }}
        title="Raw Data"
        size={"xl"}
        position="left"
      >
        {showRawData && <pre>{rawData}</pre>}
        {showElementData && (
          <pre>
            {JSON.stringify(
              periodicTable.getAllElementDataBySymbol(showElementData),
              null,
              2
            )}
          </pre>
        )}
      </Drawer>
    </>
  );
}
