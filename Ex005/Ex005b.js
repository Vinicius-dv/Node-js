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


app.listen(porta || 3000 , ()=>{console.log('Servidor rodando')})
