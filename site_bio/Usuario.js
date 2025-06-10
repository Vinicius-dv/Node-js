const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const { engine } = require('express-handlebars')
const Handlebars = require('handlebars')
const body_parser = require('body-parser')
const Perfil = require('./Models/Perfil')
const perfil = mongoose.model('perfil')


//Configurações 
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
  mongoose.connect('mongodb://localhost/perfil')
    .then(() => {
      console.log('Conectado ao mongo')
    })
    .catch((err) => {
      console.log('Erro ao se conectar' + err)
    })
  
  // Public
  app.use(express.static(path.join(__dirname, 'public')))
  
//Rotas
app.get('/',(req,res)=>{
    perfil.find().lean().then((perfil)=>{
        res.render('index',{perfil:perfil})
    })
})

app.get('/perfil',(req,res)=>{
    res.render('perfil/perfil')
})
app.post('/perfil',(req,res)=>{

    const nome = req.body.nome;
    const bio = req.body.bio;

    const novo_perfil = new perfil({
        nome:nome,
        bio:bio
        })

    novo_perfil.save().then(()=>{
        console.log('Perfil registrado com sucesso')
        res.redirect('/')
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/perfil/edit/:id',(req,res)=>{
  perfil.findOne({_id:req.params.id}).lean().then((perfil)=>{
    if(perfil){
      res.render('perfil/edit',{perfil:perfil})
    }else{
      console.log('Houve um erro')
      res.redirect('/')
    }
  })
})


app.post('/perfil/edit',(req,res)=>{
  const id = req.body.id
  const nome = req.body.nome
  const bio = req.body.bio

  perfil.findOne({_id:id}).then((perfil)=>{
    if(!perfil){
      console.log('Perfil não encontrado')
      res.redirect('/')
    }
    perfil.nome = nome
    perfil.bio = bio
      perfil.save().then(()=>{
      console.log( 'Perfil editado com sucesso')
      res.redirect('/')
      }).catch((err)=>{
        console.log(err)
      })

  })
})





const porta = process.env.PORT || 3000
app.listen(porta, () => {
  console.log('Servidor rodando')
})