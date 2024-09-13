import { endpointSymbol } from "vite-plugin-comlink/symbol";

interface CsgBrushWorkerOptions {
  onMessage?: (event: MessageEvent) => void;
}
export const makeCsgBrushWorker = (options: CsgBrushWorkerOptions) => {
  const csgBrushWorker = new ComlinkWorker<typeof import("./csgBrushCalcs.js")>(
    new URL("./csgBrushCalcs.js", import.meta.url),
    {
      name: "csgBrushCalcs",
      type: "module",
    }
  );

  if (options.onMessage) {
    csgBrushWorker[endpointSymbol].onmessage = options.onMessage;
  }
  return csgBrushWorker;
};
