const http = require('http')
const porta = 3000



const server = http.createServer((req,res)=>{
    res.writeHead(200,{
        'Content-Type':'text/html'})
        // essa barra significa a host raiz , a pagina principal
        if(req.url == '/'){
            res.write('<h1>Seja bem vindo</h1>')
        } else if(req.url == '/canal'){
            res.write('<h1>CFB Cursos</h1>')
        } if(req.url == '/curso'){
            res.write('<h1> Curso de node js </h1>')
        }

        res.end()
})

server.listen(porta,()=>{console.log('Servidor rodando')})