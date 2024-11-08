const Restaurante = require('../../models/restaurante/restaurante.Model')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')
const Cardapio = require('../../models/cardapio/cardapio.Model')
const Pedidos = require('../../models/pedido/pedido.Model') 
const { where } = require('sequelize')

const restauranteController = {
    registerRestaurant: async (req, res) =>{
        try {
            const dono = req.body.dono
            const nome = req.body.nomeDoRestaurante
            const cnpj = req.body.cnpj
            const email = req.body.email
            const senha = req.body.senha
            const endereco = req.body.endereco
            const telefone = req.body.telefone

            const findRestaurante = await Restaurante.findOne({where:{
                email
            }})

            if(findRestaurante){
                return res.status(302).json('O Restaurante já possui cadastro.')
            }

            const hashsenha = await bcrypt.hash(senha, 10)

            await Restaurante.create({
                dono: dono,
                nome: nome,
                cnpj: cnpj,
                email: email,
                senha: hashsenha,
                endereco: endereco,
                telefone: telefone
            })
            return res.status(201).json({message: "Restaurante cadastrado."})
        } catch (error) {
            return res.status(500).json({message: error})
        }
    },
    login: async (req,res) =>{
        try {
            const email = req.body.email
            const senha = req.body.senha

            const restaurant = await Restaurante.findOne({where:{email}})

            if(!restaurant){
                return res.status(400).json({message: "Email inválido."})
            }

            const found = await bcrypt.compare(senha, restaurant.senha)
            
            if(!found){
                return res.status(400).json({message: 'senha inválida'})
            } 
            const token = jwt.sign({email: restaurant.email, type: 'restaurante', id: restaurant.id}, process.env.SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
            res.status(200).json({token})
        } catch (error) {
            return  res.status(500).json({message: error})        
        }
    },


    sacarLucro: async (req, res) =>{
        try {
            const userId = req.user.id

            const saldoRestaurante = await Restaurante.findByPk(userId)
            if(saldoRestaurante.receita === 0){
                return res.status(200).json({message: "saldo zerado."})
            }
            const valorTransferencia = saldoRestaurante.receita
            saldoRestaurante.setDataValue('receita', 0)
            saldoRestaurante.save()
            return res.status(200).json({message: `Você sacou  R$ ${valorTransferencia}.\nSeu saldo no app agora é 0.`})

        } catch (error) {
            return res.status(500).json({message: error})
        }
    },

    deleteAccount: async (req, res) =>{
        try {
            const userId = req.user.id
            const restauranteSaldo = await Restaurante.findByPk(userId)
            if(restauranteSaldo.receita > 0){
                return res.status(503).json({message: 'Você ainda possui saldo na receita, realize o saque e tente novamente.'})
            }else if(restauranteSaldo.receita < 0){
                return res.status(503).json({message: 'Você ainda possui saldo negativo na receita, realize o pagamento e tente novamente.'})
            }
            await Pedidos.destroy({where:{id_restaurante:userId}})
            await Cardapio.destroy({where: {idRestaurante: userId}})
            await Restaurante.destroy({where:{id: userId}})

            return res.status(200).json({message:`conta deletada com sucesso.`})

        } catch (error) {
            return res.status(500).json({message: error})
        }
    },
    registerCardapioItem: async (req, res) =>{
        try {

            console.log(req.id)
            const nomeDoPrato = req.body.nomeDoPrato
            const preco = req.body.preco
            const idRestaurante = req.user.id
            
            const findPrato = await Cardapio.findOne({where:{
                nome_do_prato: nomeDoPrato,
                idRestaurante: idRestaurante
            }})

            if(findPrato){
                return res.status(302).json({message: "Prato já cadastrado"})
            }

            await Cardapio.create({
                nome_do_prato: nomeDoPrato,
                preco: preco,
                idRestaurante: idRestaurante
            })

            return res.status(201).json({message: "Prato cadastrado."})
        } catch (error) {
            return res.status(500).json({message: error})
        }
    },

    updateCardapioItem: async (req, res) =>{
        try{

            const nomeDoPrato = req.body.nomeDoPrato
            const campo = req.body.campo
            const value = req.body.value
            const idRestaurante = req.user.id

            const pratoID = await getPratoID(nomeDoPrato, idRestaurante)
            const findPrato = await Cardapio.findByPk(pratoID)
            if(!findPrato){
                return res.status(400).json({message: "Prato não localizado"})
            }
            
            if(campo === "nome do prato"){
                findPrato.setDataValue("nome_do_prato", value)
            }else if(campo==="preco"){
                findPrato.setDataValue("preco", parseFloat(value))
            }else{
                return res.status(400).json({message: "Campo inválido."})
            }

            findPrato.save()
            return res.status(200).json({message: `${campo} atualizado com sucesso.`})
        }catch(error){
            return res.status(500).json({message: error})
        }
    },

    deleteCardapioItem: async (req, res) =>{
        try {
            const nomeDoPrato = req.body.nomeDoPrato
            const idRestaurante = req.user.id

            const idPrato = await getPratoID(nomeDoPrato, idRestaurante)
            const findPrato = await Cardapio.findByPk(idPrato)

            if(!findPrato){
                return res.status(400).json({message: "Prato não cadastrado."})
            }
            await Pedidos.destroy({where:{id_item: idPrato}})

            await Cardapio.destroy({where:{id:idPrato}})
            return res.status(200).json({message: `${nomeDoPrato} excluido do cardapio com sucesso.`})
        } catch (error) {
            return res.status(500).json({message: error})
        }
    },
    listarPedidos: async (req,res) =>{
        try {
            const idRestaurante = req.user.id
    
            const findPedido = await Pedidos.findAll({where:{id_restaurante: idRestaurante}})
            if(findPedido.length === 0){
                return res.status(400).json({message: "Nenhum pedido registrado"})
            }
            pedidosAEntregar = findPedido.filter(pedido => pedido .status_pedido != "entregue")
            if(pedidosAEntregar.length === 0){
                return res.status(200).json({message: 'Todos os pedidos ja foram entregues'})
            }
            return res.status(200).json({
                pedidos: pedidosAEntregar.map(pedido => ({
                    id: pedido.id,
                    status: pedido.status_pedido
                }))
            })
            
        } catch (error) {
            return res.status(500).json({message: error})
        }
        
    },
    atualizarStatus: async (req, res) =>{
        try {
            const idPedido = req.body.idPedido
            const novoStatus = req.body.novoStatus
            const findPedido = await Pedidos.findByPk(idPedido)

            if(!findPedido || findPedido.status_pedido === "cancelado"){
                return res.status(404).json({message: 'Pedido não encontrado.'});
            }

            findPedido.status_pedido = novoStatus
            findPedido.save()
            return res.status(200).json({message: "Status atualizado"})

        } catch (error) {
            return res.status(500).json({message: error})
        }
    
    }
}

async function getPratoID(nome, restaurante) {
    const idItem = await Cardapio.findOne({where:{nome_do_prato: nome, idRestaurante: restaurante}})
    return idItem.id
}

module.exports = restauranteController