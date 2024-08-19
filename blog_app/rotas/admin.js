const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const cat = require('../models/Categoria')
const post = require('../models/Postagem')
const Categoria = mongoose.model('Categoria')
const Postagem = mongoose.model('Postagem')
//Aqui eu estou falando que eu quero pegar apenas o objeto eAdmin ,que é onde eu estou fazendo a verificação se a pessoa esta logada e é admin , então em cada rota que eu quero proteger de pessoas que não estão logadas ou não são admins eu boto o eAdmin na rota
const {eAdmin} = require('../helpers/eAdmin')

router.get('/',eAdmin,(req,res)=>{
    res.render('admin/index')
})

router.get('/posts',eAdmin,(req,res)=>{
    res.send('Pagina de posts')
})

router.get('/categorias',eAdmin,(req,res)=>{
    //Esse metodo find vai listar todos os documentos existentes no model categoria , e como o mongoose salva os dados em doumententos , vai aparecer todos os posts 
    Categoria.find().lean().then((categorias) =>{
        // Aqui eu estou renderizando minha view categorias e passando todas as categorias para a view 
        res.render('admin/categorias',{categorias:categorias})
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })
 
})

router.get('/categorias/add',eAdmin,(req,res)=>{
    //Aqui eu estou renderizando meu formulario addcategorias
    res.render('admin/addcategorias')
})


router.post('/categorias/nova',eAdmin,(req,res)=>{

    let erros = []

    const nome = req.body.nome;
    const slug = req.body.slug;

    if(!nome && nome.trim() === ''){
        erros.push({texto: 'Nome invalido'})
    }

    if(!slug && slug.trim() === ''){
        erros.push({texto: 'Slug invalido'})
    }
  

    if(erros.length> 0){
         res.render('admin/addcategorias',{ erros: erros, nome: nome, slug:slug })
    }else{
        const nova_categoria = new Categoria({
            nome:nome,
            slug:slug
            })
        
            //Salva os valores de nome e slug no banco de dados 
                nova_categoria.save().then(()=>{
                    req.flash('success_msg','Categoria criada com sucesso')
                    res.redirect('/admin/categorias')
                }).catch(err => {
                    req.flash('error_msg','Houve um erro ao salvar a categoria , tente novamente!')
                    res.redirect('/admin')
                });
    }

})

router.get('/categorias/edit/:id',eAdmin,(req,res)=>{
    console.log(req.params.id)
    Categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
        if (categoria) {
            res.render('admin/editcategorias', { categoria: categoria });
        } else {
            req.flash('error_msg', 'Categoria não encontrada');
            res.redirect('/admin/categorias');
        }
    }).catch((err)=>{
        req.flash('error_msg','Esta categoria não existe')
        res.redirect('/admin/categorias')
    })
}) 

router.post('/categorias/edit',eAdmin,(req,res)=>{
    const id = req.body.id
    const nome = req.body.nome
    const slug = req.body.slug

    let erros = []

    if (!nome || nome.trim() === '') {
        erros.push({ texto: 'Nome inválido' })
    }

    if (!slug || slug.trim() === '') {
        erros.push({ texto: 'Slug inválido' })
    }


    if (erros.length > 0) {
        // Se houver erros, renderize o formulário de edição novamente com erros
        Categoria.findOne({ _id: id }).lean().then((categoria) => {
            if (!categoria) {
                req.flash('error_msg', 'Categoria não encontrada')
                return res.redirect('/admin/categorias')
            }
            res.render('admin/editcategorias', { categoria: categoria, erros: erros })
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao buscar a categoria, tente novamente!')
            res.redirect('/admin/categorias')
        })
    }else{
        Categoria.findOne({_id: id}).then((categoria)=>{

            if (!categoria) {
                req.flash('error_msg', 'Categoria não encontrada')
                return res.redirect('/admin/categorias')
            }

            categoria.nome = nome
            categoria.slug = slug

            categoria.save().then(()=>{
                req.flash('success_msg','Categoria editada com sucesso')
                res.redirect('/admin/categorias')
            }).catch(()=>{
                req.flash('error_msg','Houve um erro ao atualizar o post')
                res.redirect('/admin/categorias')
            })

        }).catch((err)=>{
            req.flash('error_msg','Esta categoria não existe')
            res.redirect('/admin/categorias')
        })
    }
})

router.post('/categorias/deletar',eAdmin,(req,res)=>{
   Categoria.deleteOne({_id:req.body.id}).then(()=>{
        req.flash('success_msg','Categoria removida com sucesso')
        res.redirect('/admin/categorias')
   }).catch((err)=>{
        res.flash('error_msg','Houve um erro ao deletar o post')
        res.redirect('/admin/categorias')
   })
})

//Essa vai ser minha rota onde eu vou fazer minhas postagens
router.get('/postagens',eAdmin,(req,res)=>{
    Postagem.find().lean().populate({path: 'categoria', strictPopulate: false}).sort({data:'desc'}).then((postagens)=>{
        res.render('admin/postagens',{postagens:postagens})
    }).catch((err)=>{
        console.log(err)
        req.flash('error_msg','Houve um erro ao listar a postagem')
        res.redirect('/admin')
    })
})

router.get('/postagens/add',eAdmin,(req,res)=>{
    Categoria.find().lean().then((categorias)=>{
        //Fazendo isso ele vai passar todas as nossas categorias de postagens para a minha view addpostagens
        res.render('admin/addpostagens',{categorias:categorias})
    }).catch((err)=>{
        req.flash('error_msg','Houve um erro ao carregar o formulario')
        res.redirect('/admin')
    })
})
router.post('/postagens/nova',eAdmin,(req,res)=>{

    var erros = []

    if(req.body.categoria == 0) {
        erros.push({texto:"Cadastre uma categoria antes de criar uma nova postagem"})
    }

    if (erros.length > 0){
        res.render("admin/addpostagens", {erros: erros})
    }else{
        const nova_postagem = {
            titulo: req.body.titulo,
            slug:req.body.slug,
            descrição:req.body.descrição,
            conteudo:req.body.conteudo,
            categoria:req.body.categoria,
            data:req.body.data
        }
    

    new Postagem (nova_postagem).save().then(()=>{
        req.flash("success_msg", `Postagem ${req.body.titulo} criada com sucesso`)
        res.redirect("/admin/postagens")
    }).catch((err)=>{
        console.log(err)
    })
}
})

router.get('/postagens/edit/:id',eAdmin,(req,res)=>{

    //Aqui ele vai pesquisar uma postagem que tem o id igual a oque está sendo passado no parametro
    Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{

        Categoria.find().lean().then((categorias)=>{

            categorias.forEach(element => {
                if(JSON.stringify(element._id)==JSON.stringify(postagem.categoria._id)){
                   element.selected = 'selected';
                }
           });

            res.render('admin/editpostagens',{categorias:categorias,postagem:postagem})
        }).catch(()=>{
            req.flash('error_msg','Houve um ao buscar a categoria , crie uma se necessário')
            res.redirect('/admin/categorias')
        })

    }).catch(()=>{
        req.flash('error_msg','Houve um ao buscar a postagem')
        res.redirect('/admin/postagens')
    })

  
})

router.post('/postagens/edit',eAdmin,(req,res)=>{

    Postagem.findOne({_id:req.body.id}).lean().then((postagem)=>{
        postagem.titulo=req.body.titulo,
        postagem.slug=req.body.slug,
        postagem.descrição=req.body.descrição,
        postagem.conteudo=req.body.conteudo,
        postagem.categoria=req.body.categoria,
        postagem.data=req.body.data

        postagem.save().then(()=>{
            req.flash('success_msg','Postagem editada')
            res.redirect('/admin/postagens')
        }).catch(()=>{
            req.flash('error_msg','Houve um ao buscar ao editar a postagem')
            res.redirect('/admin/postagens')
        })
    }).catch(()=>{
        req.flash('error_msg','Houve um ao buscar a postagem')
        res.redirect('/admin/postagens')
    })

})

router.post('/postagens/deletar',eAdmin,(req,res)=>{
    Postagem.deleteOne({_id:req.body.id}).then(()=>{
         req.flash('success_msg','Postagem removida com sucesso')
         res.redirect('/admin/postagens')
    }).catch((err)=>{
         res.flash('error_msg','Houve um erro ao deletar o post')
         res.redirect('/admin/postagens')
    })
 })

module.exports = router 