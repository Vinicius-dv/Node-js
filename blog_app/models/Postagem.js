const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Postagem = new Schema({
    titulo:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    descrição:{
        type:String,
        required:true
    },
    conteudo:{
        type:String,
        required:true
    },
    categoria:{
        //Esse type significa que a categoria , vai armazenar , o id de algum objeto , e no ref eu passo o nome que eu dei pro meu outro nome 
        type:Schema.Types.ObjectId,
        ref: 'Categoria',
        required:true
    },
    data:{
        type:Date,
        default:Date.now()
    }
})

mongoose.model('Postagem',Postagem)
