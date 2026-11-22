import { app } from "./app";
import { config } from "./config";
import { prisma } from "./lib/prisma";

const server = app.listen(config.PORT, () => {
  console.log(`🚗 API Oficina em http://localhost:${config.PORT}`);
  console.log(`📚 Swagger em      http://localhost:${config.PORT}/docs`);
});

// Encerramento gracioso: fecha conexões HTTP e com o banco
for (const sinal of ["SIGINT", "SIGTERM"] as const) {
  process.on(sinal, () => {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}
