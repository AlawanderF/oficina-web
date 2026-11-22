import { Router } from "express";
import { autenticar } from "../middlewares/auth";
import { authRoutes } from "./authRoutes";
import { autorRoutes } from "./autorRoutes";
import { emprestimoRoutes } from "./emprestimoRoutes";
import { leitorRoutes } from "./leitorRoutes";
import { livroRoutes } from "./livroRoutes";

export const routes = Router();

routes.use("/auth", authRoutes); // público: cadastro e login
routes.use("/autores", autenticar, autorRoutes); // demais rotas exigem token
routes.use("/livros", autenticar, livroRoutes);
routes.use("/leitores", autenticar, leitorRoutes);
routes.use("/emprestimos", autenticar, emprestimoRoutes);
