import { Router } from "express";
import rateLimit from "express-rate-limit";
import { cadastroUsuarioSchema, loginSchema } from "shared";
import { authController } from "../controllers/authController";
import { asyncHandler } from "../lib/asyncHandler";
import { validarBody } from "../middlewares/validarSchema";

export const authRoutes = Router();

/** Limita tentativas de login/cadastro por IP (proteção contra força bruta). */
const limitador = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Muitas tentativas. Tente novamente em alguns minutos." },
});

authRoutes.post(
  "/cadastro",
  limitador,
  validarBody(cadastroUsuarioSchema),
  asyncHandler(authController.cadastrar),
);
authRoutes.post("/login", limitador, validarBody(loginSchema), asyncHandler(authController.login));
