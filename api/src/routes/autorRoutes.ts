import { Router } from "express";
import { autorSchema } from "shared";
import { autorController } from "../controllers/autorController";
import { asyncHandler } from "../lib/asyncHandler";
import { validarBody } from "../middlewares/validarSchema";

export const autorRoutes = Router();

autorRoutes.get("/", asyncHandler(autorController.listar));
autorRoutes.get("/:id", asyncHandler(autorController.buscarPorId));
autorRoutes.post("/", validarBody(autorSchema), asyncHandler(autorController.criar));
autorRoutes.put("/:id", validarBody(autorSchema), asyncHandler(autorController.atualizar));
autorRoutes.delete("/:id", asyncHandler(autorController.remover));
