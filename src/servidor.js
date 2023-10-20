const express = require('express');
const rotas = require('./rotas');

const {validarSenha} = require('./controladores/controloladores');

const app = express();

app.use(validarSenha);

app.use(express.json());

app.use(rotas);

module.exports = app;