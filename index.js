const express = require('express');
const bodyParser = require('body-parser');
const restauranteRoutes = require('./routes/restauranteRoutes');

const app = express();
const porta = 3000;

// Middleware para permitir o parse de JSON
app.use(bodyParser.json());

app.listen(porta, () => {
    console.log(`Porta ${porta}`);
});

app.use('/restaurante', restauranteRoutes);
