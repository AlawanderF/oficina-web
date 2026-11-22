import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// O pacote "shared" é CommonJS e vem do workspace: precisa ser pré-compilado pelo Vite
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { include: ["shared"] },
  build: { commonjsOptions: { include: [/shared/, /node_modules/] } },
});
