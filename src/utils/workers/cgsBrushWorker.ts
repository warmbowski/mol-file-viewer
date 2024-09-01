import { endpointSymbol } from "vite-plugin-comlink/symbol";

interface CsgBrushWorkerOptions {
  onMessage?: (event: MessageEvent) => void;
}
export const makeCsgBrushWorker = (options: CsgBrushWorkerOptions) => {
  const csgBrushWorker = new ComlinkWorker<typeof import("./cgsBrushCalcs.js")>(
    new URL("./cgsBrushCalcs.js", import.meta.url),
    {
      name: "cgsBrushCalcs",
      type: "module",
    }
  );

  if (options.onMessage) {
    csgBrushWorker[endpointSymbol].onmessage = options.onMessage;
  }
  return csgBrushWorker;
};
