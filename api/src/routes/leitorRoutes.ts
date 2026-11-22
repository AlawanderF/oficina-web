import { Router } from "express";
import { leitorSchema } from "shared";
import { leitorController } from "../controllers/leitorController";
import { asyncHandler } from "../lib/asyncHandler";
import { validarBody } from "../middlewares/validarSchema";

export const leitorRoutes = Router();

leitorRoutes.get("/", asyncHandler(leitorController.listar));
leitorRoutes.get("/:id", asyncHandler(leitorController.buscarPorId));
leitorRoutes.post("/", validarBody(leitorSchema), asyncHandler(leitorController.criar));
leitorRoutes.put("/:id", validarBody(leitorSchema), asyncHandler(leitorController.atualizar));
leitorRoutes.delete("/:id", asyncHandler(leitorController.remover));
