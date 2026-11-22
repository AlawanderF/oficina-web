import { Router } from "express";
import { autenticar } from "../middlewares/auth";
import { limiteApi } from "../middlewares/limites";
import { authRoutes } from "./authRoutes";
import { clienteRoutes } from "./clienteRoutes";
import { mecanicoRoutes } from "./mecanicoRoutes";
import { ordemServicoRoutes } from "./ordemServicoRoutes";
import { veiculoRoutes } from "./veiculoRoutes";

export const routes = Router();

// Públicas (com limite próprio de tentativas, definido em authRoutes)
routes.use("/auth", authRoutes);

// Protegidas: limite de requisições + token JWT
routes.use("/clientes", limiteApi, autenticar, clienteRoutes);
routes.use("/veiculos", limiteApi, autenticar, veiculoRoutes);
routes.use("/mecanicos", limiteApi, autenticar, mecanicoRoutes);
routes.use("/ordens-servico", limiteApi, autenticar, ordemServicoRoutes);
