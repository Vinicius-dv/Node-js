const { STRING } = require("sequelize")

// O ponto e barra significa que o arquivo está na mesma pasta do que eu estou acessando ele 
const  db = require('./db')

// Aqui eu estou criando a tabela e dando um nome para ela
const Post = db.sequelize.define('Postagens',{
    titulo: {
        type: db.Sequelize.STRING
    },
    conteudo:{
        type: db.Sequelize.TEXT
    }
})

module.exports = Post