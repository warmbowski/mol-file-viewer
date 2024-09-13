import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import { comlink } from "vite-plugin-comlink";
import { visualizer } from "rollup-plugin-visualizer";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      "@state": path.resolve(__dirname, "./src/state"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
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
