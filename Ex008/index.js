require('dotenv').config()
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
})

// Abaixo está a forma de como criar uma tabela com sequelize , dentro de {} eu defini as minhas colunas
const postagem = sequelize.define('Postagem',{
    titulo:{
        type: Sequelize.STRING
    },
    conteudo:{
        type: Sequelize.TEXT
    }
})

//Esse método vai inserir dados nas minhas colunas 
/*postagem.create({
    titulo: 'Fala peixes',
    conteudo: 'Vamos falar hoje sobre bobby fisher'
})*/

// Este método vai  sincronizar a nossa table  com o mysql , ja o parametro force serve para ter certeza que a table foi gerada
//postagem.sync({force: true})

const usuario = sequelize.define('usuarios',{
    nome:{
        type: Sequelize.STRING
    },
    sobrenome:{
        type: Sequelize.STRING
    },
    idade: {
        type: Sequelize.INTEGER

    },
    email:{
        type: Sequelize.STRING
    }
})
/*usuario.create({
    nome: 'vinicius',
    sobrenome:'henrrique',
    idade:14,
    email:'vini@teste.com'
})*/