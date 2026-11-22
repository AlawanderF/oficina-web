import { Router } from "express";
import { ordemServicoSchema } from "shared";
import { ordemServicoController } from "../controllers/ordemServicoController";
import { asyncHandler } from "../lib/asyncHandler";
import { validarBody } from "../middlewares/validarSchema";

export const ordemServicoRoutes = Router();

ordemServicoRoutes.get("/", asyncHandler(ordemServicoController.listar));
ordemServicoRoutes.get("/:id", asyncHandler(ordemServicoController.buscarPorId));
ordemServicoRoutes.post("/", validarBody(ordemServicoSchema), asyncHandler(ordemServicoController.criar));
ordemServicoRoutes.put(
  "/:id",
  validarBody(ordemServicoSchema),
  asyncHandler(ordemServicoController.atualizar),
);
ordemServicoRoutes.delete("/:id", asyncHandler(ordemServicoController.remover));
