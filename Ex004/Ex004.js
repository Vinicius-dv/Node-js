const http = require('http')
const fs = require('fs')
const porta = process.env.PORT

const server = http.createServer((req,res)=>{
    // com esse método eu posso anexar arquivos nele , basta eu apenas informar o nome do arquivo , e 
    //tbm preciso criar uma função que vai ter dois parametros um vai ser se der um retorno de erro e o outro vai ser o retorno do arquivo
    fs.readFile('index.html',(err,arquivo)=>{
        res.writeHead(200,{'Content-Type':'text/html'})
        res.write(arquivo)
       return res.end()
    })
})

server.listen(porta || 3000, ()=>{console.log('servidor rodando')})