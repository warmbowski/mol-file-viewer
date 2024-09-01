import { pTable, PTableParsed } from "periodic-table-data-complete";
import { FIXED_RADIUS_H_PM, FIXED_RADIUS_PM } from "..";
import { ColorTheme, colorThemes } from "../colorThemes.noformat";

const orderedPeriodicTableArray = JSON.parse(pTable) as PTableParsed;

export interface ElementData {
  symbol: string;
  color: string;
  name: string;
  atomic_number: number;
  atomic_mass: number;
  radius: {
    fixed: number;
    calculated: number;
    empirical: number;
    covalent: number;
    vanderwaals: number;
  };
}

export class PeriodicTable {
  public theme: ColorTheme = ColorTheme.ALT;
  private periodicTableByAtomicSymbolMap = new Map<string, ElementData>([]);

  constructor(colorTheme?: ColorTheme) {
    if (colorTheme !== undefined) {
      this.theme = colorTheme;
      this.periodicTableByAtomicSymbolMap = new Map(
        orderedPeriodicTableArray.map((el) => {
          const elData: ElementData = {
            symbol: el.symbol,
            name: el.name,
            atomic_number: el.atomic_number,
            atomic_mass: el.atomic_mass,
            color:
              colorThemes[el.symbol][this.theme] ||
              `#${el.cpk_hex || "ffffff"}`,
            radius: {
              fixed:
                (el.symbol === "H" ? FIXED_RADIUS_H_PM : FIXED_RADIUS_PM) / 100,
              calculated: (el.radius?.calculated || 0) / 100,
              empirical: (el.radius?.empirical || 0) / 100,
              covalent: (el.radius?.covalent || 0) / 100,
              vanderwaals: (el.radius?.vanderwaals || 0) / 100,
            },
          };
          return [el.symbol, elData];
        })
      );
    }
  }

  public getElementDataBySymbol(symbol: string) {
    return this.periodicTableByAtomicSymbolMap.get(symbol);
  }

  public setColorTheme(colorTheme: ColorTheme) {
    this.theme = colorTheme;
  }
}
