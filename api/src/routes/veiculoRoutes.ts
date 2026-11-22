import { Router } from "express";
import { veiculoSchema } from "shared";
import { veiculoController } from "../controllers/veiculoController";
import { asyncHandler } from "../lib/asyncHandler";
import { validarBody } from "../middlewares/validarSchema";

export const veiculoRoutes = Router();

veiculoRoutes.get("/", asyncHandler(veiculoController.listar));
veiculoRoutes.get("/:id", asyncHandler(veiculoController.buscarPorId));
veiculoRoutes.post("/", validarBody(veiculoSchema), asyncHandler(veiculoController.criar));
veiculoRoutes.put("/:id", validarBody(veiculoSchema), asyncHandler(veiculoController.atualizar));
veiculoRoutes.delete("/:id", asyncHandler(veiculoController.remover));
