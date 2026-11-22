import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // os testes de integração compartilham o mesmo banco: rodar em série
    fileParallelism: false,
    testTimeout: 20_000,
  },
});
