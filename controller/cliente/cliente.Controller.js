const Cliente = require('../../models/cliente/cliente.Model')


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
                return res.status(400).json({message: 'Email inválido.'});
            }

            const found = await bcrypt.compare(senha, user.senha);
            
            if(!found){
                return res.status(400).json({message: 'senha inválida'});
            }

            const token = jwt.sign({email: user.email}, process.env.SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})

            res.json({token})

        } catch (error) {
            return res.status(500).json({message: error})
        }
    },

    deleteAccount: async (req, res) =>{
        try {
            const userId = req.id

            const deleted = await Cliente.destroy({where:{id: userId}})

        } catch (error) {
            
        }
    }
}