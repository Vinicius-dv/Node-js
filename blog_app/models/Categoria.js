const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoria = new Schema({
    nome:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        //Esse default signifca que se o usuario não botar nada , a data vai ser a hora exata que ele foi registrado no banco de dados
        default:Date.now
}
})

const Categoria = mongoose.model('Categoria', categoria)
module.exports = Categoria;
