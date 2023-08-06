const express = require('express');
const {
    contasBancariasExistentes,
    criarContaBancaria,
    atualizarUsuarioDaConta,
    excluirConta,
    depositar, 
    sacar,
    transferir,
    consultarSaldo} = require('./controladores/controloladores');

const rotas = express();

rotas.get('/:senha_banco', contasBancariasExistentes);
rotas.post('/contas', criarContaBancaria)
rotas.put('/contas/:numeroConta/usuario', atualizarUsuarioDaConta)
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post(`/transacoes/depositar`, depositar);
rotas.post(`/transacoes/sacar`, sacar);
rotas.post(`/transacoes/transferir`, transferir);
rotas.get(`/saldo?numero_conta=123&senha=123`, consultarSaldo);

module.exports = rotas;