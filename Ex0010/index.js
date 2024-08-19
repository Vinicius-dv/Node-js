const { type } = require('express/lib/response');
const mongoose = require('mongoose');

// URL de conexão com o MongoDB (pode ser local ou remoto)
const mongoDBURL = 'mongodb://localhost:27017/aprendendo';

// Conectando ao MongoDB usando Mongoose
mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado ao MongoDB com sucesso!');
})
.catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
});

//Model mongoose , o Schema é um padrão que usam  , dentro de mongoose.Schema eu defino meu módulo
const usuarioSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true
    },
    sobrenome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    pais:{
        type:String,
    },
    idade:{
        type:Number,
        required:true
    }
})

//Dentro do () de model eu boto qual vai ser o nome da colection , tipo a table do mysql , e no segundo parametro eu falo o nome do módulo
const usuario = mongoose.model('Usuarios',usuarioSchema)

usuario.create({
    nome: 'Vinicius',
    sobrenome: 'Henrique',
    email: 'vinicius@mail.com',
    pais: 'Brasil',
    idade: 15
}).then(()=>{
    console.log('Usuario criado com sucesso')
}).catch((err)=>{
    console.log('Aconteceu um erro '+err)
})

