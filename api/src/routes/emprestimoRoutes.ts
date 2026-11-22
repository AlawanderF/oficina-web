import { Router } from "express";
import { emprestimoSchema } from "shared";
import { emprestimoController } from "../controllers/emprestimoController";
import { asyncHandler } from "../lib/asyncHandler";
import { validarBody } from "../middlewares/validarSchema";

export const emprestimoRoutes = Router();

emprestimoRoutes.get("/", asyncHandler(emprestimoController.listar));
emprestimoRoutes.get("/:id", asyncHandler(emprestimoController.buscarPorId));
emprestimoRoutes.post("/", validarBody(emprestimoSchema), asyncHandler(emprestimoController.criar));
emprestimoRoutes.put("/:id", validarBody(emprestimoSchema), asyncHandler(emprestimoController.atualizar));
emprestimoRoutes.delete("/:id", asyncHandler(emprestimoController.remover));
