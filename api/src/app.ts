import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { config } from "./config";
import { tratarErros } from "./middlewares/erros";
import { routes } from "./routes";
import { swaggerSpec } from "./swagger";

/** Monta a aplicação Express (separada do listen para poder ser testada). */
export const app = express();

app.disable("x-powered-by");
// CSP desligada apenas porque a UI do Swagger usa scripts inline
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.CORS_ORIGIN.split(",").map((o) => o.trim()) }));
app.use(express.json({ limit: "100kb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "API Oficina" }));
app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ message: "Rota não encontrada" });
});
app.use(tratarErros); // sempre por último
