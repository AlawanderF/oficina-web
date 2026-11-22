import { Router } from "express";
import { livroSchema } from "shared";
import { livroController } from "../controllers/livroController";
import { asyncHandler } from "../lib/asyncHandler";
import { validarBody } from "../middlewares/validarSchema";

export const livroRoutes = Router();

livroRoutes.get("/", asyncHandler(livroController.listar));
livroRoutes.get("/:id", asyncHandler(livroController.buscarPorId));
livroRoutes.post("/", validarBody(livroSchema), asyncHandler(livroController.criar));
livroRoutes.put("/:id", validarBody(livroSchema), asyncHandler(livroController.atualizar));
livroRoutes.delete("/:id", asyncHandler(livroController.remover));
