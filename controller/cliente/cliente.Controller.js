const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const Cliente = require('../../models/cliente/cliente.Model')
const Restaurante = require('../../models/restaurante/restaurante.Model.js')
const Cardapio = require('../../models/cardapio/cardapio.Model.js')
const Pedidos = require('../../models/pedido/pedido.Model')


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

            const token = jwt.sign({email: user.email}, process.env.SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})

            res.status(200).json({token})

        } catch (error) {
            return res.status(500).json({message: error})
        }
    },

    deleteAccount: async (req, res) =>{
        try {
            const userId = req.id

            await Cliente.destroy({where:{id: userId}})

            return res.status(200).json({message:`conta deletada com sucesso.`})

        } catch (error) {
            return res.status(500).json({message: error})
        }
    },

    pesquisar_pratos: async (req, res) =>{
        try {
            const prato = req.body.prato

            const opcoes = []
            const itens = await Cardapio.findAll({where:{nome_do_prato: prato}})

            itens.array.forEach(item => {
                const opcao = getRestaurante(item.id)
                opcoes.push({'prato': item.nome, 'restaurante': opcao})
            })

            opcoes.json_encoded()

            return res.status(200).json(opcoes)

        } catch (error) {
            return res.status(400).json({message: error})
        }
    },

    realizarPedido: async (req, res) => {
        const token = req.headers.authorization(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET)
        const usrId = decoded.id
        try {
            const restaurante = req.body.restaurante
            const prato = req.body.prato
            const quantidade = req.body.quantidade
            const pagamento = req.body.pagamento
            const endereco = req.body.endereco
            const entrega = req.body.entrega

            const pratoID = getPratoID(prato, restaurante)


            const pedido = Pedidos.create({
                id_item: pratoID,
                quantidade: quantidade,
                forma_pagamento: pagamento,
                tipo_entrega: entrega,
                id_usuario: usrId,
                endereco_entrega: endereco,
                status_pedido: "realizado"
            })

            return res.status(201).json({message: `Pedido realizado com sucesso.\n${pedido}`})
            
        } catch (error) {
            return res.status(500).json({message: error})
        }
    },

    cancelarPedido: async (req, res) => {
        try {
            const idPedido = req.body.idPedido
            const findPedido = Pedidos.findByPk(idPedido)

            if(!findPedido || findPedido.status_pedido === "cancelado"){
                return res.status(404).json({message: 'Pedido não encontrado.'});
            }

            findPedido.setDataValue('status_pedido', 'cancelado')
            findPedido.save()
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


module.exports = clienteController;