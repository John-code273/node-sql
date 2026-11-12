import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function buscarClientes() {
      const url = "http://localhost:3001/clientes";

      try {
        const response = await fetch(url);
        const clientes = await response.json();

        setData(clientes);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    }

    buscarClientes();
  }, []);

  return (
    <div className="grid grid-cols-3 h-screen bg-fuchsia-950 text-fuchsia-900 webkit-text-stroke-[2px]">
      <div
        className="
        bg-rose-100 rounded-br-[5rem] rounded-tr-[5rem]
      col-span-1 col-start-1 
       p-8 shadow-cyan-400 shadow-[1px_1px_40px_1px_rgba(37,92,200,0.5)] w-full h-full flex flex-col gap-32 justify-center my-auto items-center
       place-items-center"
      >
        <h1 className="text-6xl font-bold ">Clientes</h1>
        <ul className="list-none">
           <p className="text-lg font-semibold mb-5">{data.length} clientes encontrados</p>
          {data.map((cliente) => (
            <li key={cliente.id}>

              {cliente.nome} - {cliente.idade} anos
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
