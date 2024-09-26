const Sequelize = require('sequelize')
const db = require('../../connection/db')
const Restaurante = require('../restaurante/restaurante.Model')

const Cardapio = db.connection.define('cardapio',{
    id: {
        type:{
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        }
    },
    nome_do_prato:{
        type: Sequelize.STRING,
        allowNull: false
    },
    preco:{
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        validate:{
            isDecimal: true,
            min:0.99
        }
    },
    idRestaurante:{
        type: Sequelize.UUID,
        allowNull: false,
        references:{
            model: Restaurante,
            key:'id'
        }
    }

})

module.exports = Cardapio