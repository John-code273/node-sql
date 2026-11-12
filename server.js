import "dotenv/config";
import express from "express";
import sql from "mssql";
import cors from "cors";

const app = express();
app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

let configCon = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_BANCO,
  port: parseInt(process.env.DATABASE_PORTA),
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

// Conexao com o banco...
const db = new sql.ConnectionPool(configCon);

db.connect(function (err, conn) {
  if (err) {
    console.log(err);
  } else {
    console.log("Conexão com banco de dados: OK");
  }
});

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
export default executeQuery;

app.listen(process.env.PORTA_API, () => {
  console.log(`Servidor rodando na porta ${process.env.PORTA_API}`);
});
