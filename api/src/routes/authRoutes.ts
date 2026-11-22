import { Router } from "express";
import { cadastroUsuarioSchema, loginSchema } from "shared";
import { authController } from "../controllers/authController";
import { asyncHandler } from "../lib/asyncHandler";
import { limiteAutenticacao } from "../middlewares/limites";
import { validarBody } from "../middlewares/validarSchema";

export const authRoutes = Router();

authRoutes.post(
  "/cadastro",
  limiteAutenticacao,
  validarBody(cadastroUsuarioSchema),
  asyncHandler(authController.cadastrar),
);
authRoutes.post("/login", limiteAutenticacao, validarBody(loginSchema), asyncHandler(authController.login));
