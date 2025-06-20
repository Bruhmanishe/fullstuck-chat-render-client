import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     "/chat": {
  //       target: "ws://localhost:3000/",
  //       changeOrigin: true,
  //       ws: true,
  //       rewrite: (path) => path.replace(/^\/chat/, ""),
  //     },
  //     "/api": {
  //       target: "http://localhost:3000/",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ""),
  //     },
  //   },
  // },
  // base: "/full-stuck-chat/",
  define: {
    "process.env.VITE_BACKEND_HTTP": JSON.stringify(
      process.env.VITE_BACKEND_HTTP
    ),
    "process.env.VITE_BACKEND_WS": JSON.stringify(process.env.VITE_BACKEND_WS),
  },
});
