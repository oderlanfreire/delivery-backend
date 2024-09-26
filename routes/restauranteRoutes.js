// routes/restauranteRoutes.js

const express = require('express');
const Restaurante = require('../models/Restaurante');

const router = express.Router();

router.post('/cadastro', (req, res) => {
    const { dono, nome, CNPJ, lucro, email, senha, endereco, telefone } = req.body;

    const restaurante = new Restaurante(1, dono, nome, CNPJ, lucro, email, senha, endereco, telefone);

    res.status(200).json({
        message: 'Restaurante criado com sucesso!',
        restaurante: restaurante.apresentar()
    });
});

router.get('/login', (req, res) => {
    const { email, senha } = req.body;

    res.status(200).json({
        message: 'Login realizado com sucesso!'
    });
});

router.post('/excluir', (req, res) => {
    const { ID, email } = req.body;

    res.status(200).json({
        message: 'Restaurante excluído com sucesso!'
    });
});

module.exports = router;
