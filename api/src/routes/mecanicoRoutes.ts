import { Router } from "express";
import { mecanicoSchema } from "shared";
import { mecanicoController } from "../controllers/mecanicoController";
import { asyncHandler } from "../lib/asyncHandler";
import { validarBody } from "../middlewares/validarSchema";

export const mecanicoRoutes = Router();

mecanicoRoutes.get("/", asyncHandler(mecanicoController.listar));
mecanicoRoutes.get("/:id", asyncHandler(mecanicoController.buscarPorId));
mecanicoRoutes.post("/", validarBody(mecanicoSchema), asyncHandler(mecanicoController.criar));
mecanicoRoutes.put("/:id", validarBody(mecanicoSchema), asyncHandler(mecanicoController.atualizar));
mecanicoRoutes.delete("/:id", asyncHandler(mecanicoController.remover));
