const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const Cliente = require('../../models/cliente/cliente.Model')
const Restaurante = require('../../models/restaurante/restaurante.Model.js')
const Cardapio = require('../../models/cardapio/cardapio.Model.js')
const Pedidos = require('../../models/pedido/pedido.Model')
const { where } = require("sequelize")


const clienteController = {
    registerClient: async (req, res) =>{
        try {
            const nome = req.body.nome
            const email = req.body.email
            const senha = req.body.senha
            const endereco = req.body.endereco
            const telefone = req.body.telefone

            const findClient = await Cliente.findOne({where: {email}})
            if(findClient){
                return res.status(302).json({message: 'o Cliente já possui cadastro'})
            }

            const hashsenha = await bcrypt.hash(senha, 10);

            await Cliente.create({
                nome,
                email,
                senha: hashsenha,
                endereco,
                telefone
            })
            return res.status(201).json({message: "Cliente cadastrado com sucesso."})
        } catch (error) {
            return res.status(500).json({message: error})
        }
    },

    login: async (req, res) =>{
        try {
            const email = req.body.email
            const senha = req.body.senha

            const user = await Cliente.findOne({where:{email}})

            if(!user){
                return res.status(400).json({message: 'Email inválido.'})
            }

            const found = await bcrypt.compare(senha, user.senha);
            
            if(!found){
                return res.status(400).json({message: 'senha inválida'})
            }

            const token = jwt.sign({email: user.email, type: "cliente", id: user.id}, process.env.SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})

            res.status(200).json({token})

        } catch (error) {
            return res.status(500).json({message: error})
        }
    },

    deleteAccount: async (req, res) =>{
        try {
            const userId = req.user.id

            // await Pedidos.destroy({where:{id_usuario: userId}})

            await Cliente.destroy({where:{id: userId}})

            return res.status(200).json({message:`conta deletada com sucesso.`})

        } catch (error) {
            return res.status(500).json({message: error})
        }
    },

    pesquisarPratos: async (req, res) =>{
        try {
            const prato = req.body.prato

            const opcoes = []
            const itens = await Cardapio.findAll({where:{nome_do_prato: prato}})

            for(const i of itens){
                console.log(i)
                const opcao = await getRestaurante(i.idRestaurante)
                console.log(opcao)
                opcoes.push({'prato': i.nome_do_prato, 'restaurante': opcao})

            }

            return res.status(200).json(opcoes)

        } catch (error) {
            return res.status(400).json({message: error})
        }
    },

    realizarPedido: async (req, res) => {
        try {
            const userId = req.user.id
            const restaurante = req.body.restaurante
            const prato = req.body.prato
            const quantidade = req.body.quantidade
            const pagamento = req.body.pagamento
            const endereco = req.body.endereco
            const entrega = req.body.entrega

            const pratoID = await getPratoID(prato, restaurante)
            idRestaurante = await Restaurante.findOne({where:{nome: restaurante}})

            const pedido = await Pedidos.create({
                id_item: pratoID,
                nome_do_prato: prato,
                id_restaurante: idRestaurante.id,
                quantidade: quantidade,
                forma_pagamento: pagamento,
                tipo_entrega: entrega,
                id_usuario: userId,
                endereco_entrega: endereco,
                status_pedido: "aguardando confirmação"
            })
            return res.status(201).json({message: `Pedido realizado com sucesso. Id do pedido: ${pedido.id}`})
            
        } catch (error) {
            return res.status(500).json({message: error})
        }
    },

    cancelarPedido: async (req, res) => {
        try {
            const idPedido = req.body.idPedido
            const findPedido = await Pedidos.findByPk(idPedido)

            if(!findPedido || findPedido.status_pedido === "cancelado"){
                return res.status(404).json({message: 'Pedido não encontrado.'});
            }

            findPedido.status_pedido = 'cancelado'
            await findPedido.save()
            return res.status(200).json({message: "pedido cancelado pelo usuário."})

        } catch (error) {
            return res.status(500).json({message: error})
        }
    }

}


async function getRestaurante(id){
    const restaurante = await Restaurante.findByPk(id)
    if(!restaurante){
        return null
    }

    return restaurante.nome
}

async function getPratoID(nome, restaurante) {
    const idRestaurante = await Restaurante.findOne({where: {nome: restaurante}})
    const idItem = await Cardapio.findOne({where:{nome_do_prato: nome, idRestaurante: idRestaurante.id}})

    return idItem.id
}

console.log(clienteController)
module.exports = clienteController;