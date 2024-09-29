const Sequelize = require("sequelize")
const db = require('../../connection/db')
const Cardapio = require('../cardapio/cardapio.Model')
const Cliente = require('../cliente/cliente.Model')
const Restaurante = require('../restaurante/restaurante.Model')

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
    id_restaurante:{
        type: Sequelize.UUID,
        allowNull: false,
        references:{
            model: Restaurante,
            key:'id'
        }
    },
    nome_do_prato:{
        type: Sequelize.STRING,
        allowNull: false
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
            isIn:{
                args:[["credito", "debito", "pix", "dinheiro", "carteira do app"]],
                msg: 'Apenas estas possibilidades: "credito", "debito", "pix", "dinheiro", "carteira do app"'
            }
        }
    },
    tipo_entrega:{
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            isIn:{
                args:[["delivery", "entrega pelo restaurante", "retirada no restaurante"]],
                msg: 'Apenas 3 possibilidades: "delivery", "entrega pelo restaurante" e "retirada no restaurante"'
            }
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
        validate:{
            isIn:{
                args:[["aguardando confirmação","cancelado", "confirmado, prato sendo preparado", "saiu para a entrega", "aguardando retirada no restaurante", "entregue"]],
                msg: 'Apenas 4 possibilidades: "aguardando confirmação", "cancelado", "confirmado, prato sendo preparado", "saiu para a entrega", "aguardando retirada no restaurante", "entregue"'
            }
        }
    }
})

module.exports = Pedidos