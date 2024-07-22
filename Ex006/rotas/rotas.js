const express = require('express')
const rotas = express.Router()


// Nesse array json tenho informações sobre cursos
let cursos_info = [
    {'Curso':'node','Info':'Curso de node'},
    {'Curso':'react','Info':'Curso de react'},
    {'Curso':'angular','Info':'Curso de angular'},
    {'Curso':'php','Info':'Curso de php'},
    {'Curso':'java','Info':'Curso de java'},
    {'Curso':'python','Info':'Curso de python'}
]

rotas.get('/',(req,res)=>{
    res.json({ola:'Seja bem-vindo'})
})


// Essa linha de código abaixo significa que oque tiver após a 
/// sera armazenado na const curso ou seja em cursoi esta verificando se o curso armazenado na const curso é igual a o que 
//está escrito na url se for true ele escreve o curso e as informações em um objeto json.
rotas.get('/:cursoid',(req,res)=>{
    const curso = req.params.cursoid
    const cursoi = cursos_info.find(i=>i.Curso == curso)

    if(!cursoi){
        res.status(404).json({erro:'Curso não encontrado'})
    }else{
        res.status(200).json(cursoi)
    }
})

module.exports = rotas
