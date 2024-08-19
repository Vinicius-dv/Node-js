const local_strategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bycript = require('bcryptjs')

//Model de usuario
const Usuario = require('../models/usuario')
const usere = mongoose.model('usuarios')

module.exports = function(passport){
    //aqui eu estou dizendo qual o campo vai ser analizado 
    passport.use(new local_strategy({usernameField: 'email',passwordField: 'senha'},(email,senha,done)=>{
        //Aqui ele vai pesquisar por um email , igual ao que esta sendo passado na autentificação
        console.log('Autenticando usuário:', email)
        Usuario.findOne({email:email}).lean().then((usuario)=>{
            if(!usuario){
                //Ent no done você passa 3 parametros os  1 dados da conta que foi autenticada , 2 se a autenticação ocorreu com suceso ou não e no 3 a mensagem
                return done(null,false, {message:'Esta conta não existe'})
            }else{
                //Aqui eu vou comparar a senha que o usuario quer fazer login com a senha ja existente  , ja nos parametros eu estou passando um se der erro e o outro se as senhas forem iguais
                bycript.compare(senha , usuario.senha,(erro,batem)=>{

                    if(batem){
                        return done(null,usuario)
                    }else{
                        return done(null,false , {message:'Senha incorreta'})
                    }
                })
            }
        })
    }))

    //Isso aqui serve para salvar os dados do usuario em uma sessão
    passport.serializeUser((usuario,done)=>{
        console.log('Serializando usuário:', usuario);
        //Aqui eu vou passar os dados do usario para uma sessão
        done(null,usuario)
    })
     //Isso aqui serve para salvar os dados do usuario em uma sessão , ent assim que o usuario logar , vai ficar salvo os dados dele no site
   
     passport.deserializeUser((id,done)=>{
        console.log('Deserializando usuário com ID:', id);
        Usuario.findById(id).lean().then((usuario)=>{
            done(null,usuario)
        }).catch((err)=>{
             done (null,false,{message:'algo deu errado'})
        })
    })

}