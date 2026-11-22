import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../lib/AppError";
import { jwtSecret } from "../middlewares/auth";
import { usuarioRepository } from "../repositories/usuarioRepository";

// Remove a senha (hash) antes de qualquer resposta da API
const semSenha = ({ senha: _senha, ...resto }: { id: number; nome: string; email: string; senha: string }) => resto;

export const authService = {
  async cadastrar(dados: { nome: string; email: string; senha: string }) {
    if (await usuarioRepository.buscarPorEmail(dados.email)) {
      throw new AppError(409, "Já existe um usuário com este e-mail");
    }
    // bcrypt gera um hash com "sal": a senha digitada nunca é guardada
    const hash = await bcrypt.hash(dados.senha, 10);
    const usuario = await usuarioRepository.criar({ ...dados, senha: hash });
    return semSenha(usuario);
  },

  async login(dados: { email: string; senha: string }) {
    const usuario = await usuarioRepository.buscarPorEmail(dados.email);
    // mesma mensagem para e-mail ou senha errados (não revela qual existe)
    const ok = usuario && (await bcrypt.compare(dados.senha, usuario.senha));
    if (!usuario || !ok) throw new AppError(401, "E-mail ou senha inválidos");
    const token = jwt.sign({ sub: usuario.id }, jwtSecret(), { expiresIn: "8h" });
    return { token, usuario: semSenha(usuario) };
  },
};
