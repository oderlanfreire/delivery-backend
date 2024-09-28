const Pedidos = require('../../models/pedido/pedido.Model')
const Restaurante = require('../../models/restaurante/restaurante.Model')
const Cardapio = require('../../models/cardapio/cardapio.Model')

const pedidosController = {
    fazerPedido: async (req, res) =>{
        try {
            const nome_do_restaurante = req.body.restaurante
            const prato = req.body.prato
            const quantidade = req.body.quantidade
            const endereco = req.body.endereco
            const tipo_de_entrega = req.body.tipo_de_entrega
            const forma_de_pagamento = req.body.forma_de_pagamento

            const findRestaurante = await Restaurante.findOne({where: {nome_do_restaurante}})
            const findPrato = await Cardapio.findOne({where: {prato}})


            if(!findRestaurante){
                return res.status(404).json({message: 'Restaurante não encontrado.'})
            }

            if(!findPrato){
                return res.status(404).json({message: 'Prato não cadastrado ou indisponível.'})
            }


            const pedidoFeito = await Pedidos.create({
                id_item: findPrato.id,
                id_restaurante: findRestaurante.id,
                nome_do_prato: prato,
                quantidade: quantidade,
                forma_pagamento: forma_de_pagamento,
                tipo_entrega: tipo_de_entrega,
                id_usuario: id_usuario,
                endereco_entrega: endereco,
                status_pedido: "aguardando confirmação"
            })
            
            return res.status(201).json({
                message:"Pedido realizado com sucesso! Faça o acompanhamento do pedido:",
                idPedido: pedidoFeito.id
            })


        } catch (error) {
            return res.status(500).json({ message: 'Erro ao criar pedido.' })
        }
    },
    acompanharPedido: async(req, res) =>{
        try {
            const id = req.body.id

            const findPedido = Pedidos.findByPk(id)

            if(!findPedido){
                return res.status(400).json({message: "Pedido não encontrado"})
            }
            
            return res.status(403).json({
                message: "Status do pedido:",
                statusPedido: findPedido.status_pedido
            })
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar pedido.' })
        }
    }

}


module.exports =  pedidosController