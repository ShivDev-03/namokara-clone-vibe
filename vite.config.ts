import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiProxy = env.VITE_DEV_API_PROXY || "http://localhost:3000";

  return {
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    /**
     * When `VITE_API_BASE_URL` is empty, the app fetches same-origin paths like `/v1/...`.
     * The dev server forwards those to the real API to avoid CORS in the browser.
     */
    proxy: {
      "/v1": {
        target: apiProxy,
        changeOrigin: true,
      },
    },
  },
  preview: {
    proxy: {
      "/v1": {
        target: apiProxy,
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  };
});
