const clienteController = require('../controller/cliente/cliente.Controller')
const restauranteController = require('../controller/restaurante/restauranteController')
const auth = require('../middleware/authenticate')
const express = require('express')

const router = express.Router()

//cliente
router.post('/cliente/register', clienteController.registerClient)
router.post('/cliente/login', clienteController.login)
router.delete('/cliente/delete', auth, clienteController.deleteAccount)
router.post('/cliente/search-food', auth, clienteController.pesquisarPratos)
router.post('/cliente/place-order', auth, clienteController.realizarPedido)
router.put('/cliente/cancel-order', auth, clienteController.cancelarPedido)


//restaurante
router.post('/restaurante/register', restauranteController.registerRestaurant)
router.post('/restaurante/login', restauranteController.login)
router.get('/restaurante/withdraw', auth, restauranteController.sacarLucro)
router.delete('/restaurante/delete', auth, restauranteController.deleteAccount)
router.post('/restaurante/register-item-menu', auth, restauranteController.registerCardapioItem)
router.put('/restaurante/update-item-menu', auth, restauranteController.updateCardapioItem)
router.delete('/restaurante/delete-item-menu', auth, restauranteController.deleteCardapioItem)
router.get('/restaurante/list-order', auth, restauranteController.listarPedidos)
router.put('/restaurante/update-order-status', auth, restauranteController.atualizarStatus)


module.exports = router