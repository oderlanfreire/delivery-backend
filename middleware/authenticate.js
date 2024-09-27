const jwt = require('jsonwebtoken')
const user = require('../models/cliente/cliente.Model')
const restaurant = require('../models/restaurante/restaurante.Model')
const secret = process.env.SECRET

async function loginUserVerify(req, res, next) {
    const header = req.headers['authorization']
    if(!header){
        return res.status(400).json({message: "Acesso Negado."})
    }
    const token = header.split(' ')[1]

    try {
        const decoded = jwt.verify(token, secret)
        const loginId = decoded.id

        let login = await user.findByPk(loginId)

        if(!login){
            login = await restaurant.findByPk(loginId)
        }

        if(!login){
            return res.status(404).json({message:"Usuario não encontrado."})
        }

        req.user = login
        next()
    } catch (error) {
        return res.status(500).json({message: error})
    }
}