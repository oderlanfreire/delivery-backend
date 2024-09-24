const Sequelize  = require('sequelize')
const db = require("../../connection/db")

const Cliente = db.connection.define('cliente', {
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate:{
            args: true,
            msg: 'Insira um email válido'
        }
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false
    },
    endereco:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    telefone:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            len: [10, 15],
            is: /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/
        }
    }
})

module.exports  = Cliente