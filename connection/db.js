const Sequelize = require('sequelize')

const db = process.env.DB;
const user = process.env.USER;
const password = process.env.PASS;
const dialect = process.env.DIALECT || 'mysql';


const connection = new Sequelize(db, user, password, {
    host: process.host.HOST || 'localhost',
    dialect: dialect, 
    timezone: "-03:00"
})

const closeConnection = async () =>{
    try {
        await connection.close()
        console.log("Conexão com o banco fechada.")
    } catch (error) {
        console.log("Erro ao fechar conexão com banco", error)
    }
}

module.exports = {
    connection, closeConnection
}