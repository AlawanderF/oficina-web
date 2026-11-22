import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Autores from "./pages/Autores";
import Cadastro from "./pages/Cadastro";
import Emprestimos from "./pages/Emprestimos";
import Home from "./pages/Home";
import Leitores from "./pages/Leitores";
import Livros from "./pages/Livros";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      {/* Layout bloqueia quem não fez login */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/autores" element={<Autores />} />
        <Route path="/livros" element={<Livros />} />
        <Route path="/leitores" element={<Leitores />} />
        <Route path="/emprestimos" element={<Emprestimos />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
