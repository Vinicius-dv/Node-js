const Sequelize = require('sequelize');

// Conexão com o banco de dados. Passamos 4 parâmetros:
// 1. Nome do banco de dados
// 2. Usuário do MySQL
// 3. Senha do banco de dados
// 4. Um objeto JSON com configurações adicionais
const seque = new Sequelize('teste', 'root', 'laionel', {
    host: 'localhost',
    dialect: 'mysql'
});

// Função que verifica a conexão com o banco de dados
// O then trata o sucesso e o catch trata os erros
seque.authenticate()
    .then(() => {
        console.log('Servidor rodando');
    })  
    .catch((err) => {
        console.error('Não foi possível conectar ao banco de dados:', err);
    });


