const Sequelize = require("sequelize")
const db = require("../../connection/db")

const Restaurante = db.connection.define('restaurante',{
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    dono:{
        type: Sequelize.STRING,
        allowNull: false
    },
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    cnpj:{
        type: Sequelize.STRING,
        allowNull: true
    },
    receita:{
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true
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
        validate: {
            len: [10, 15],
            is: /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/
        }
    }

})


module.exports = Restaurante