import { Card, SimpleGrid, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { usuarioLogado } from "../services/auth";

const cartoes = [
  { to: "/autores", titulo: "Autores", desc: "Cadastro de autores" },
  { to: "/livros", titulo: "Livros", desc: "Livros e seus autores" },
  { to: "/leitores", titulo: "Leitores", desc: "Pessoas que pegam livros" },
  { to: "/emprestimos", titulo: "Empréstimos", desc: "Quem pegou qual livro" },
];

export default function Home() {
  return (
    <>
      <Title order={2} mb="xs">Olá, {usuarioLogado()?.nome}!</Title>
      <Text c="dimmed" mb="lg">Escolha uma área para gerenciar:</Text>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
        {cartoes.map((c) => (
          <Card key={c.to} withBorder component={Link} to={c.to} style={{ textDecoration: "none" }}>
            <Title order={4}>{c.titulo}</Title>
            <Text size="sm" c="dimmed">{c.desc}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </>
  );
}
