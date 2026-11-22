import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { CadastroUsuarioInput, LoginInput } from "shared";
import { config } from "../config";
import { AppError } from "../lib/AppError";
import { usuarioRepository } from "../repositories/usuarioRepository";

/** Custo do bcrypt: 2^10 rodadas. Deixa o hash lento de propósito contra força bruta. */
const BCRYPT_ROUNDS = 10;

/**
 * Hash "falso" usado quando o e-mail não existe. Assim o login sempre roda o bcrypt
 * e leva o mesmo tempo nos dois casos: o tempo de resposta não revela quais e-mails existem.
 */
const HASH_FALSO = bcrypt.hashSync("senha-inexistente-para-tempo-constante", BCRYPT_ROUNDS);

type UsuarioComSenha = { id: number; nome: string; email: string; senha: string; criadoEm: Date };

/** Remove o hash da senha antes de qualquer resposta da API. */
const semSenha = ({ senha: _senha, ...publico }: UsuarioComSenha) => publico;

export const authService = {
  async cadastrar(dados: CadastroUsuarioInput) {
    if (await usuarioRepository.buscarPorEmail(dados.email)) {
      throw new AppError(409, "Já existe um usuário com este e-mail", { email: "E-mail já cadastrado" });
    }
    // Guardamos só o hash (com salt aleatório). Nem quem acessa o banco descobre a senha.
    const hash = await bcrypt.hash(dados.senha, BCRYPT_ROUNDS);
    const usuario = await usuarioRepository.criar({ ...dados, senha: hash });
    return semSenha(usuario);
  },

  async login(dados: LoginInput) {
    const usuario = await usuarioRepository.buscarPorEmail(dados.email);
    // compare() refaz o hash da senha digitada com o salt guardado e compara.
    // Roda SEMPRE (com o hash falso se o e-mail não existir) para o tempo ser constante.
    const senhaConfere = await bcrypt.compare(dados.senha, usuario?.senha ?? HASH_FALSO);
    // Mesma mensagem para e-mail ou senha errados: não revela quais e-mails existem.
    if (!usuario || !senhaConfere) throw new AppError(401, "E-mail ou senha inválidos");

    const token = jwt.sign({ sub: String(usuario.id), nome: usuario.nome }, config.JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "8h",
    });
    return { token, usuario: semSenha(usuario) };
  },
};
