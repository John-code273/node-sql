import "dotenv/config";
import express from "express";
import sql from "mssql";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

const configCon = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_BANCO,
  port: Number.parseInt(process.env.DATABASE_PORTA ?? "", 10),
  pool: {
    max: 20,
    min: 5,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: false,
  },
  requestTimeout: 60000,
};

const db = new sql.ConnectionPool(configCon);

async function executeQuery(sqlQuery) {
  const request = db.request();
  const { recordset } = await request.query(sqlQuery);
  return recordset;
}

app.get("/clientes", async (request, response) => {
  try {
    const results = await executeQuery(
      "SELECT * FROM [testeNode].[dbo].[t_teste]",
    );
    response.json(results);
  } catch (error) {
    console.error("Erro ao consultar t_teste:", error);
    response.status(500).json({ error: "Não foi possível consultar t_teste." });
  }
});

app.post("/clientes", async (request, response) => {
  const { nome, idade } = request.body ?? {};
  const idadeNumerica = Number(idade);

  if (
    typeof nome !== "string" ||
    !nome.trim() ||
    !Number.isInteger(idadeNumerica) ||
    idadeNumerica < 0
  ) {
    response.status(400).json({ error: "Informe um nome e uma idade válida." });
    return;
  }

  try {
    await db
      .request()
      .input("nome", sql.NVarChar, nome.trim())
      .input("idade", sql.Int, idadeNumerica)
      .query(
        "INSERT INTO [testeNode].[dbo].[t_teste] (nome, idade) VALUES (@nome, @idade)",
      );
    response.status(201).json({ nome: nome.trim(), idade: idadeNumerica });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    response.status(500).json({ error: "Não foi possível cadastrar o cliente." });
  }
});

app.delete("/clientes/:id", async (request, response) => {
  const id = Number(request.params.id);

  if (!Number.isInteger(id) || id < 1) {
    response.status(400).json({ error: "Informe um ID de cliente válido." });
    return;
  }

  try {
    const result = await db
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM [testeNode].[dbo].[t_teste] WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      response.status(404).json({ error: "Cliente não encontrado." });
      return;
    }

    response.status(204).end();
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    response.status(500).json({ error: "Não foi possível excluir o cliente." });
  }
});

const apiPort = Number.parseInt(process.env.PORTA_API ?? "", 10);

if (!Number.isInteger(apiPort) || apiPort < 1 || apiPort > 65535) {
  throw new Error("PORTA_API precisa ser uma porta válida.");
}

try {
  await db.connect();
  console.log("Conexão com banco de dados: OK");
  app.listen(apiPort, () => {
    console.log(`Servidor rodando na porta ${apiPort}`);
  });
} catch (error) {
  console.error("Não foi possível conectar ao banco de dados:", error);
  process.exitCode = 1;
}
