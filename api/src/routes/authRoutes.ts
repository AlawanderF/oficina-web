import { Router } from "express";
import { cadastroUsuarioSchema, loginSchema } from "shared";
import { authController } from "../controllers/authController";
import { asyncHandler } from "../lib/asyncHandler";
import { validarBody } from "../middlewares/validarSchema";

export const authRoutes = Router();

authRoutes.post("/cadastro", validarBody(cadastroUsuarioSchema), asyncHandler(authController.cadastrar));
authRoutes.post("/login", validarBody(loginSchema), asyncHandler(authController.login));
