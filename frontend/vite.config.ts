import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  // "shared" é CommonJS vindo do workspace: o Vite precisa pré-compilá-lo
  optimizeDeps: { include: ["shared"] },
  build: {
    commonjsOptions: { include: [/shared/, /node_modules/] },
    rollupOptions: {
      output: {
        // separa bibliotecas grandes em chunks próprios (melhor cache no navegador)
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          mantine: ["@mantine/core", "@mantine/hooks", "@mantine/notifications"],
          icons: ["@tabler/icons-react"],
        },
      },
    },
  },
});
