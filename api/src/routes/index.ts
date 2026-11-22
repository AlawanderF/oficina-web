import { Router } from "express";
import { autenticar } from "../middlewares/auth";
import { authRoutes } from "./authRoutes";
import { clienteRoutes } from "./clienteRoutes";
import { mecanicoRoutes } from "./mecanicoRoutes";
import { ordemServicoRoutes } from "./ordemServicoRoutes";
import { veiculoRoutes } from "./veiculoRoutes";

export const routes = Router();

// Públicas
routes.use("/auth", authRoutes);

// Protegidas por JWT
routes.use("/clientes", autenticar, clienteRoutes);
routes.use("/veiculos", autenticar, veiculoRoutes);
routes.use("/mecanicos", autenticar, mecanicoRoutes);
routes.use("/ordens-servico", autenticar, ordemServicoRoutes);
