const express = require('express')
const app = express()
const porta = process.env.PORT

// Aqui no get eu preciso indicar a rota e preciso botar os parametro req e res 
app.get('/',(req,res)=>{
    res.send('Seja Bem Vindo')
})

app.get('/canal',(req,res)=>{
    res.json({canal: 'CFB Cursos'})
})

app.get('/blog',(req,res)=>{
    res.send('Seja bem vindo ao meu blog')
})

app.get('/ola',(req,res)=>{
    res.send('Forneça um nome na url , na frente do ola')
})

// nesse exemplo abaixo eu criei um param dinamico ou sejá oque estiver na frente de olá ele vai escrever na tela. OBS: Só podemos enviar um send por rota
app.get('/ola/:nome',(req,res)=>{
    const nome = req.params.nome
    res.send('Ola '+req.params.nome+' Sou foda')
    
})

app.listen(porta || 3000 , ()=>{console.log('Servidor rodando')})

