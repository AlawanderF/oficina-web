import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { CadastroUsuarioInput, LoginInput } from "shared";
import { config } from "../config";
import { AppError } from "../lib/AppError";
import { usuarioRepository } from "../repositories/usuarioRepository";

/** Custo do bcrypt: 2^10 rodadas. Deixa o hash lento de propósito contra força bruta. */
const BCRYPT_ROUNDS = 10;

type UsuarioComSenha = { id: number; nome: string; email: string; senha: string; criadoEm: Date };

/** Remove o hash da senha antes de qualquer resposta da API. */
const semSenha = ({ senha: _senha, ...publico }: UsuarioComSenha) => publico;

export const authService = {
  async cadastrar(dados: CadastroUsuarioInput) {
    if (await usuarioRepository.buscarPorEmail(dados.email)) {
      throw new AppError(409, "Já existe um usuário com este e-mail");
    }
    // Guardamos só o hash (com salt aleatório). Nem quem acessa o banco descobre a senha.
    const hash = await bcrypt.hash(dados.senha, BCRYPT_ROUNDS);
    const usuario = await usuarioRepository.criar({ ...dados, senha: hash });
    return semSenha(usuario);
  },

  async login(dados: LoginInput) {
    const usuario = await usuarioRepository.buscarPorEmail(dados.email);
    // compare() refaz o hash da senha digitada com o salt guardado e compara.
    const senhaConfere = usuario ? await bcrypt.compare(dados.senha, usuario.senha) : false;
    // Mesma mensagem para e-mail ou senha errados: não revela quais e-mails existem.
    if (!usuario || !senhaConfere) throw new AppError(401, "E-mail ou senha inválidos");

    const token = jwt.sign({ sub: String(usuario.id), nome: usuario.nome }, config.JWT_SECRET, {
      expiresIn: "8h",
    });
    return { token, usuario: semSenha(usuario) };
  },
};
