const Sequelize = require("sequelize")
const db = require('../../connection/db')
const Cardapio = require('../cardapio/cardapio.Model')
const Cliente = require('../cliente/cliente.Model')

const Pedidos = db.connection.define('pedidos', {
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    id_item:{
        type: Sequelize.UUID,
        allowNull: false,
        references:{
            model: Cardapio,
            key:'id'
        }
    },
    quantidade:{
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    forma_pagamento:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            args:[["credito", "debito", "pix", "dinheiro", "carteira do app"]],
            msg: 'Apenas estas possibilidades: "credito", "debito", "pix", "dinheiro", "carteira do app"'
        }
    },
    tipo_entrega:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            args:[["delivery", "entrega pela loja", "retirada na loja"]],
            msg: 'Apenas 3 possibilidades: "delivery", "entrega pela loja" e "retirada na loja"'
        }
    },
    id_usuario:{
        type: Sequelize.UUID,
        allowNull: false,
        references:{
            model: Cliente,
            key:'id'
        }
    },
    endereco_entrega:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    status_pedido:{
        type: Sequelize.STRING,
        allowNull: false,
    },
})

module.exports = Pedidos