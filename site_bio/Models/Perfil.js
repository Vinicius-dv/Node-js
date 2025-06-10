const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Perfil = new Schema({
    nome:{
        type:String,
        required:true
    },
    bio:{
        type: String,
        required:true
    }

})

const perfil = mongoose.model('perfil',Perfil)
module.exports = perfil