import mysql from 'mysql2 /promise';

const conexao = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'node-sql'
});
try {
  await conexao.query('SELECT 1');
  console.log('Conexão com o MySQL realizada com sucesso.');
} finally {
  await conexao.end();
}

conexao.connect(function(err){
  if (err) throw err;  
  console.log('Conexão com o MySQL realizada com sucesso.');
});



