const Cliente = require('../models/cliente/cliente.Model')
const Cardapio = require('../models/cardapio/cardapio.Model')
const Pedido = require('../models/pedido/pedido.Model')
const Restaurante = require('../models/restaurante/restaurante.Model')

Cliente.sync()
Cardapio.sync()
Pedido.sync()
Restaurante.sync()