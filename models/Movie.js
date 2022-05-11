//Importar o pacote do mongoose
const mongoose = require('mongoose')

//Criar uma entidade de receba os metodos para criar, pegar, atualizar ... (cria uma tabela no banco de dados)
const Movie = mongoose.model('Movie', {
    name: String,
    year: Number,
    streaming: Boolean
})

//Exportar a entidade
module.exports = Movie