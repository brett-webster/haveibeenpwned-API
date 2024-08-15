import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer"; // npm i --save-dev rollup-plugin-visualizer

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "./dist/bundle-stats.html",
      open: true,
    }), // allows for bundle visualization (auto-opens in browser & saves to /dist folder on 'npm run build' completion)
  ],
  // build: {
  //   // added customize code splitting on build for smaller bundle or faster performance
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes("node_modules")) {
  //           return "vendor";
  //         }
  //         if (id.includes("src/components")) {
  //           return "components";
  //         }
  //       },
  //     },
  //   },
  // },
  server: {
    port: Number(process.env.npm_package_config_vite_app_server_port), // set to PORT 8080 in package.json config
    open: true, // open the browser automatically
    cors: true, // enable CORS

    // set up proxy to redirect API calls
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.npm_package_config_proxy_server_port}`, // set to PORT 3000 in package.json config & passed thru DEV script
        changeOrigin: true,
      },
    },
  },
});
