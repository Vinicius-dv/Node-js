const http = require('http')
const fs = require('fs')
const porta = process.env.PORT

const server = http.createServer((req,res)=>{
   
    // Com esse método eu crio um arquivo , posso criar o conteúdo dentro dele , 
    //esse método tem apenas o parametro de erro , ent no exemplo abaixo , se der erro ele aprensenta a mensagem de erro , se não ele ira criar o arquivo e apresentar a msg arquivo criado
    fs.appendFile('index.txt', 'Curso de node js',(err)=>{
        if(err)throw err

        console.log('Arquivo criado')
        res.end()
    })
})

server.listen(porta || 3000, ()=>{console.log('servidor rodando')})