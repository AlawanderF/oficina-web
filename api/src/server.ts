import "dotenv/config";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { tratarErros } from "./middlewares/erros";
import { routes } from "./routes";
import { swaggerSpec } from "./swagger";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routes);
app.use(tratarErros); // sempre por último

const port = Number(process.env.PORT) || 3333;
app.listen(port, () => {
  console.log(`API em http://localhost:${port}  |  Swagger em http://localhost:${port}/docs`);
});
