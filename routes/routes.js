const clienteController = require('../controller/cliente/cliente.Controller')
const restauranteController = require('../controller/restaurante/restauranteController')
const express = require('express')

const router = express.Router()

//cliente
router.post('cliente/register', clienteController.registerClient)
router.post('cliente/login', clienteController.login)
router.delete('cliente/delete', clienteController.deleteAccount)
router.post('cliente/search-food', clienteController.pesquisarPratos)
router.post('cliente/place-order', clienteController.realizarPedido)
router.put('cliente/cancel-order', clienteController.cancelarPedido)


//restaurante
router.post('restaurante/register', restauranteController.registerRestaurant)
router.post('restaurante/login', restauranteController.login)
router.get('restaurante/withdraw', restauranteController.sacarLucro)
router.delete('restaurante/delete', restauranteController.deleteAccount)
router.post('restaurante/register-item-menu', restauranteController.registerCardapioItem)
router.put('restaurante/update-item-menu', restauranteController.updateCardapioItem)
router.delete('restaurante/delete-item-menu', restauranteController.deleteCardapioItem)
router.get('restaurante/list-order', restauranteController.listarPedidos)
router.put('restaurante/update-order-status', restauranteController.atualizarStatus)


module.exports = router