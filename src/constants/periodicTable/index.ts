import { pTable, PTableParsed } from "periodic-table-data-complete";
import { FIXED_RADIUS_H_PM, FIXED_RADIUS_PM } from "..";

const orderedPeriodicTableArray = JSON.parse(pTable) as PTableParsed;

export const periodicTableByAtomicNumberMap = new Map(
  orderedPeriodicTableArray.map((el) => {
    const elData = {
      symbol: el.symbol,
      color: `#${el.cpk_hex || "ffffff"}`,
      radius: {
        fixed: (el.symbol === "H" ? FIXED_RADIUS_H_PM : FIXED_RADIUS_PM) / 100,
        calculated: (el.radius?.calculated || 0) / 100,
        empirical: (el.radius?.empirical || 0) / 100,
        covalent: (el.radius?.covalent || 0) / 100,
        vanderwaals: (el.radius?.vanderwaals || 0) / 100,
      },
    };
    return [el.atomic_number, elData];
  })
);

export const periodicTableBySymbolMap = new Map(
  [...periodicTableByAtomicNumberMap.values()].map((el) => [el.symbol, el])
);
