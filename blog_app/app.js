// Carregando módulos
const express = require('express')
const { engine } = require('express-handlebars')
const body_parser = require('body-parser')
const app = express()
const admin = require('./rotas/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const Handlebars = require('handlebars')
const post = require('./models/Postagem')
const Postagem = mongoose.model('Postagem')
const cat = require('./models/Categoria')
const Categoria = mongoose.model('Categoria')
const usuarios = require('./rotas/usuario')
const passport = require('passport')
require('./config/auth')(passport)

// Configurações
// Session
app.use(session({
  secret: 'Curso de node',
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize())
app.use(passport.session())

// Flash
app.use(flash({ sessionKeyName: 'flashMessage' }))

// Middlewares
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error'),
  //Aqui eu estou armazenando os dados do usuario logado
  res.locals.user = req.user || null
  next()
})

// Configurando o Handlebars com as opções de runtime
app.engine('handlebars', engine({
  defaultLayout: 'main',
  handlebars: Handlebars.create({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
    }
  })
}))
app.set('view engine', 'handlebars')

// Body-parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/blogapp')
  .then(() => {
    console.log('Conectado ao mongo')
  })
  .catch((err) => {
    console.log('Erro ao se conectar' + err)
  })

// Public
app.use(express.static(path.join(__dirname, 'public')))

// Rotas
  app.get('/',(req,res)=>{
    Postagem.find().lean().populate('categoria').sort({data:'desc'}).then((postagens)=>{
      res.render('index',{postagens:postagens})

    }).catch((err) => {
      req.flash("error_msg", "Houve um erro interno")
      res.statusCode(404)
  })
})

app.get('/postagens/:slug',(req,res)=>{
    Postagem.findOne({slug:req.params.slug}).lean().then((postagens)=>{
      if(postagens){
        res.render('postagem/index',{postagens:postagens})
      }else{
        req.flash("error_msg", "Esta postagem não existe")
        res.redirect('/')
      }
    }).catch((err)=>{
      console.log(err)
      req.flash('error_msg','Houve um erro ao buscar a postagem')
      res.redirect('/')
    })
})


app.get('/categorias',(req,res)=>{
  Categoria.find().lean().then((categorias)=>{
      res.render('categorias/categorias',{categorias,categorias})
  }).catch((err)=>{
    console.log(err)
    req.flash('error_msg','Houve um erro ao listar as categorias')
    res.redirect('/')
  })
})

app.get('/categorias/:slug',(req,res)=>{
  //Aqui eu vou achar uma categoria que tenha o slug igual ao slug que foi passado no parametro ou seja se eu criei um slug chamado javascrpit ele vai procurar por um slug chamado javascript
  Categoria.findOne({slug: req.params.slug}).lean().then((categoria)=>{
    if(categoria){
      //Basicamente ele vai pesquisar os posts que pertencem a esta categoria pelo slug passado no parametro
      Postagem.find({categoria:categoria._id}).lean().then((postagens)=>{
        res.render('categorias/postagens',{postagens:postagens,categoria:categoria})
      }).catch((err)=>{
      console.log(err)
      req.flash('error_msg','Houve um erro ao listar as categorias')
      res.redirect('/')
    })
    }else{
      req.flash('error_msg','Esta categoria não existe')
      res.redirect('/')
    }
  }).catch((err)=>{
    console.log(err)
    req.flash('error_msg','Houve um erro ao listar as categorias')
    res.redirect('/')
  })
})


app.use('/admin', admin)
app.use('/usuarios',usuarios)
// Outros
const porta = process.env.PORT || 3000
app.listen(porta, () => {
  console.log('Servidor rodando')
})
