//Importar o pacote do express
const express = require('express')
//Importar o pacote do mongoose
const mongoose = require('mongoose')
//Importar a entidade Movie
const Movie = require('./models/Movie')
//Importar as variaveis de ambiente
require('dotenv').config()


//Inicializar o pacote
const server = express()

//Conectar com o banco do mongoDB
mongoose
    .connect(process.env.DATABASE_URL, 
        {
            useNewUrlParser: true,
        }
    ).then(() => {
        console.log("Conectado ao mongo db atlas")
    }).catch((erro) => {
        console.log(erro)
    })

//Configurar a porta
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
    console.log("Servidor conectado ao MongoDB...")
})

server.use(
    express.urlencoded({
        extended: true,
    }),
)

server.use(express.json())


//criar nossa rota inicial
server.get('/', (req, res) => {
    res.json({
        message: "Bem Vindo a nossa API com MongoDB"
    })
})

//criar nossa rota para criar/salvar um filme no bando de dados (POST)
// async -> como leva um tempo e não temos garantia que vamos receber alguma informação, utilizamos essa função que retorna uma promessa.
server.post('/movie', async(req, res) => {
    //Pegar as informações do corpo da nossa requisição 
    const {name, year, streaming} = req.body

    //Colocar as informações em um objeto chamado movie
    const movie = {
        name,
        year,
        streaming
    }

    //criar/salvar essa informação no banco, mas pode falhar 
    try{
        //esperar para garantir e criar os dados
        await Movie.create(movie)

        //enviar uma resposta com sucesso
        res.status(201).json({message: 'Filme inserido no banco com sucesso !'})

    } catch (error){
        //enviar uma resposta com o erro
        res.status(500).json({message: error})
    }
})

//Criar uma rota para listar todos os filmes cadastrados (GET)
server.get('/movies', async (req,res) => {

    // a busca pode falhar então é preciso tratar
    try{
        // metodo .find() lista todos os filmes do banco e coloca na variavel movies
        const movies = await Movie.find()

        //retorna em formato json 
        res.status(200).json(movies)

    } catch (error){
        //retorna a mensagem de erro caso acontecer
        res.status(500).json({message: error})
    }
})

//Criar uma rota para buscar somente 1 filme pelo id (GET)
server.get('/movie/:id', async (req,res) => {
    const id = req.params.id

    try{
        //const movie = await Movie.findOne({_id: id})
        const movie = await Movie.findById(id)

        //validação caso não ache um usuário
        if (!movie) {
            req.status(422).json({message: "Nenhum filme encontrado"})
            return
        }

        res.status(200).json(movie)

    } catch (error) {
        res.status(500).json({message: error})
    }
})

//Atualizar os dados do usuário (PUT)
server.put('/movie/:id', async (req,res) => {
    const id = req.params.id

    const {name, year, streaming} = req.body

    const movie = {
        name,
        year,
        streaming 
    }

    try{
        const updatedMovie = await Movie.updateOne({_id: id}, movie)   
        
        //Validação caso não encontre um filme
        if(updatedMovie.matchedCount === 0){
            res.status(422).json({message: "Filme não encontrado"})
            return
        }

        res.status(200).json(movie)
        

    } catch (error){
        res.status(500).json({message: error})
    }
})

//Deletar um filme no banco de Dados (Delete)
server.delete('/movie/:id', async (req,res) => {
    const id = req.params.id

    try{
        const movie = await Movie.findById(id)
        await Movie.deleteOne({_id: id})
        res.status(200).json({message: "O filme foi removido com sucesso"})

    } catch (error){
        res.status(500).json({message: error})

    }

})