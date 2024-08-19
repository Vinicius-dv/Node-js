//Express-handlebars
const express = require('express')
const app = express()
const porta = process.env.PORT
const { engine } = require('express-handlebars')
const body_parser = require('body-parser')
const post = require('./models/post')

//Configurando o handlebars
    //template engine
    //Basicamente com essas duas linhas de códigos dizemos ao express que queremos usa o handlebars como template engine , 
    //o main significa que este é o template padrão da nossa aplicação
    app.engine('handlebars',engine({defaultLayout:'main'}))
    app.set('view engine','handlebars')

    //Configurando o body-parser
    app.use(body_parser.urlencoded({extended:false}))
    app.use(body_parser.json())



//Rotas

app.get('/',(req,res)=>{
    //Dando um post.all ele vai me retornar todos os posts que tem na minha table postagens , 
    //e os posts vai cair dentro do parametro posts do then , ja as chaves dentro do render significa que eu posso passar qualquer tipo de dado pro front-end
    post.findAll().then((posts)=>{
        res.render('home',{posts: posts})
    })
    
})

app.get('/cad',(req,res)=>{
    //Com esse método eu estou renderizando o o formulario que eu criei no handlebars
    res.render('formulario')
})

//Preciso definir a rota como post por conta que meu formulario é do method post 
app.post('/add',(req,res)=>{
    //para eu pegar os dados de um formulario eu uso o body.o nome que eu defini no campo que eu quero pegar o dado
    post.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    }).then(()=>{
        res.redirect('/')
    }).catch((err)=>{
        res.send('ocorreu o seguinte erro '+err)
    })

  
})


// Rota para exibir o formulário de edição
app.get('/editar/:id', (req, res) => {
    // Encontra o post pelo ID fornecido na URL
    post.findByPk(req.params.id).then((post) => {
        // Renderiza a view 'editar' e passa o post encontrado
        res.render('editar', { post: post });
    }).catch((err) => {
        // Exibe uma mensagem de erro se não conseguir encontrar o post
        res.send('Erro ao buscar post: ' + err);
    });
});

// Rota para atualizar o post
app.post('/update/:id', (req, res) => {
    // Atualiza o post com os novos dados fornecidos pelo formulário
    post.update(
        {
            titulo: req.body.titulo,
            conteudo: req.body.conteudo
        },
        {
            where: { id: req.params.id } // Atualiza o post com o ID fornecido na URL
        }
    ).then(() => {
        // Redireciona para a página inicial após a atualização
        res.redirect('/');
    }).catch((err) => {
        // Exibe uma mensagem de erro se não conseguir atualizar o post
        res.send('Erro ao atualizar post: ' + err);
    });
});

app.get('/deletar/:id',(req,res)=>{
    // Sempre que eu quiser excluir um  recurso dentro do meu banco de dados , dentro da tabela 
    post.destroy({where: {'id': req.params.id}}).then(()=>{
    res.send('Postagem deletada com sucesso')
    }).catch((err)=>{
        res.send('ocorreu um erro '+err)
    })
})



app.listen(porta||3000,()=>{console.log('Servidor rodando')})