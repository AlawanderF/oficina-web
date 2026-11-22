import { Router } from "express";
import { clienteSchema } from "shared";
import { clienteController } from "../controllers/clienteController";
import { asyncHandler } from "../lib/asyncHandler";
import { validarBody } from "../middlewares/validarSchema";

export const clienteRoutes = Router();

clienteRoutes.get("/", asyncHandler(clienteController.listar));
clienteRoutes.get("/:id", asyncHandler(clienteController.buscarPorId));
clienteRoutes.post("/", validarBody(clienteSchema), asyncHandler(clienteController.criar));
clienteRoutes.put("/:id", validarBody(clienteSchema), asyncHandler(clienteController.atualizar));
clienteRoutes.delete("/:id", asyncHandler(clienteController.remover));
