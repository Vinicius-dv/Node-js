const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuario = new Schema({
    nome:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    eAdmin:{
        //Ent a lógica vai ser a seguinte , quando um usuario normal se cadastrar por padrão o campo eAdmin dele vai ser igual a 0 ou seja ele não é admin , os usuarios que foream admin vai receber o eAdmin 1
        type:Number,
        default:0
    },
    senha:{
        type:String,
        required:true
    }
})

const Usuario = mongoose.model('usuarios', usuario)
module.exports = Usuario;