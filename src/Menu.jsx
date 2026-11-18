import api from "/src/Api";
import { useEffect, useState } from "react";
import Input from "./componentes/Input";
import { X } from "lucide-react";

export default function Menu() {
  const [clientes, setClientes] = useState([]);
  const [mostrarInput, setMostrarInput] = useState(false);
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const { data } = await api.get("/clientes");
      setClientes(data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      setMensagem("Não foi possível carregar os clientes.");
    }
  };

  const cadastrarCliente = async (evento) => {
    evento.preventDefault();
    try {
      await api.post("/clientes", { nome, idade: Number(idade) });
      setNome("");
      setIdade("");
      alternarVisibilidade();
      await carregarClientes();
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  };


  const deletarCliente = async (id) => {
    try {
      await api.delete(`/clientes/${id}`);
      await carregarClientes();
    } catch (error) {
      console.error("Erro ao deletar um cliente:", error);
    }
  };

  const alternarVisibilidade = () => {
    setMostrarInput(!mostrarInput);
  };

  const handleChange1 = (evento) => {
    setNome(evento.target.value);
  };

  const handleChange2 = (evento) => {
    setIdade(evento.target.value);
  };
  return (
    <div
      className="
        bg-indigo-950 sm:rounded-br-[10rem] md:rounded-tr-4xl
        col-span-3 col-start-1 sm:col-span-2 md:col-span-1 
        p-5 sm:shadow-cyan-400 sm:shadow-[1px_1px_40px_1px_rgba(37,92,200,0.5)] w-full h-full flex flex-col gap-10 justify-center items-center
        place-items-center "
    >
      <h1 className="xl:text-5xl md:text-4xl text-6xl font-bold">Clientes</h1>
      <ul className="list-none ">
        <p className="text-lg font-semibold mb-0">
          {clientes.length} clientes encontrados
        </p>
        {clientes.map((cliente) => (
          <li key={cliente.id} className="text-2xl sm:text-[20px] whitespace-nowrap ">
            {cliente.nome} - {cliente.idade} anos
            <button type="button" onClick={() => deletarCliente(cliente.id)}>
              <X className="w-3 ml-2 h-3 rounded-sm hover:bg-red-500 cursor-pointer bg-red-700 text-amber-50 "/>
            </button>
          </li>
        ))}
      </ul>
      {mostrarInput && (
        <form
          onSubmit={cadastrarCliente}
          className="bg-fuchsia-400 h-40 rounded-2xl p-2 w-36 md:w-48"
        >
          <p className="text-black">digite os campos:</p>

          <Input tipo={"text"} value={nome} func={handleChange1} pl={"nome"}/>
          <Input tipo={"text"} value={idade} func={handleChange2} pl={"idade"} />
          <button
            className="bg-green-500 hover:bg-emerald-700 text-black px-3 rounded-lg mt-2"
            type="submit"
          >
            cadastrar
          </button>
        </form>
      )}
      <button
        onClick={alternarVisibilidade}
        className="bg-rose-500 text-white text-2xl sm:text-sm whitespace-rap px-4 rounded-xl hover:bg-rose-600 sm:w-22 md:w-27"
      >
        Adicionar Cliente
      </button>
    </div>
  );
}
