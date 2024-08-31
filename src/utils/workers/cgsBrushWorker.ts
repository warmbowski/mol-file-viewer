export const csgBrushWorker = new ComlinkWorker<
  typeof import("./cgsBrushCalcs.js")
>(new URL("./cgsBrushCalcs.js", import.meta.url), {
  name: "cgsBrushCalcs",
  type: "module",
});
