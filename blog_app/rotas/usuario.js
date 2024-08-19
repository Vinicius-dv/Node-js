const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const use = require('../models/usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/registro',(req,res)=>{
    res.render('usuarios/registro')
})

router.post('/registro',(req,res)=>{
    let erros = []

    
    const nome = req.body.nome
    const email = req.body.email
    const senha = req.body.senha

    if(!nome && nome.trim() === ''){
        erros.push({texto: 'Nome invalido'})
    }

    if(!email && email.trim() === ''){
        erros.push({texto: 'Email invalido'})
    }

    if(!senha && senha.trim() === ''){
        erros.push({texto: 'Email invalido'})
    }

    
    if(senha.length <=4){
        erros.push({texto: 'Senha muito curta'})
    }

     
    if(senha.length >=15){
        erros.push({texto: 'Senha muito longa'})
    }

     
    if(senha != req.body.senha2){
        erros.push({texto: 'As senhas são diferentes , tente novamente!'})
    }

    if(erros.length>0){

        res.render('usuarios/registro',{erros:erros})

    }else{
        //Aqui eu estou pesquisando um usuario, que tenha um email, igual ao email, que o usuario esta tentando se cadastrar 
        Usuario.findOne({email:req.body.email}).lean().then((usuario)=>{
            //Se usuario for true significa que ja tem um email , que o usuario , quer cadastrar
            if(usuario){
            req.flash('error_msg','Este email ja está cadastrado')
            res.redirect('/usuarios/registro')
            }else{
                //O salt é um valor aleatório gerado para tornar o hash único para cada senha.
                //O hash é o resultado final que combina a senha e o salt, e é o que você armazena e usa para comparar com senhas fornecidas durante o login.
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(req.body.senha, salt)

            const UserData = {
                nome : req.body.nome,
                email : req.body.email,
                senha : hash,
             }

             new Usuario(UserData).save().then(() => {
                req.flash('success_msg', 'Usuario cadastrado com sucesso!')
                res.redirect('/')
            }).catch((err) => {
                req.flash('error_msg', 'Erro ao cadastrar o usuario')
                res.redirect("/usuarios/registro")
            })

            }
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro interno')
            res.redirect('/')
    })
    }

})

router.get('/login',(req,res)=>{
    res.render('usuarios/login')
})

router.post('/login',(req,res,next)=>{
    console.log('Login attempt:', req.body)
    passport.authenticate('local',{
        //Aqui eu vou informar qual vai ser o caminho caso a autentificação ocorra com sucesso
        successRedirect: '/',
        failureRedirect: '/usuarios/login',
        failureFlash: true
    })(req,res,next)
})

router.get('/logout',(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        req.flash('success_msg', "Deslogado com sucesso!")
        res.redirect('/')
    })
})  
module.exports = router 