import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { comlink } from "vite-plugin-comlink";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [comlink(), react(), visualizer() as PluginOption],
  worker: {
    plugins: () => [comlink()],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("three") || id.includes("tslib")) {
            return "@threejs";
          }
          if (id.includes("periodic-table-data-complete")) {
            return "@periodic-table-data";
          }
        },
      },
    },
  },
});
