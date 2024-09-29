require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./connection/db')
const syncDB = require('./connection/syncDB')
const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require('./swagger.json')
const routes = require("./routes/routes")

const app = express()


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

connection.connection.authenticate().then(() =>{
    console.log("Conexão com banco realizada com sucesso!")
}).catch((error) =>{
    console.log("Falha ao conectar", error)
})

process.on('SIGINT', async() =>{
    await connection.closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async() =>{
    await connection.closeConnection();
    process.exit(0);
})  

app.use('/', routes)
app.get('/', (req, res) =>{
    res.send("API rodando")
})

app.listen(8080, ()=>{
    console.log("Server rodando");
})