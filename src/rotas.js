const express = require('express');
const {
    contasBancariasExistentes,
    criarContaBancaria,
    atualizarUsuarioDaConta,
    excluirConta,
    depositar, 
    sacar,
    transferir,
    consultarSaldo,
    extrato} = require('./controladores/controloladores');

const rotas = express();

rotas.get('/:senha_banco', contasBancariasExistentes);
rotas.post('/contas', criarContaBancaria)
rotas.put('/contas/:numeroConta/usuario', atualizarUsuarioDaConta)
rotas.delete('/contas/:numeroConta', excluirConta);
rotas.post(`/transacoes/depositar`, depositar);
rotas.post(`/transacoes/sacar`, sacar);
rotas.post(`/transacoes/transferir`, transferir);
rotas.get(`/contas/saldo`, consultarSaldo);
rotas.get(`/contas/extrato`, extrato);

module.exports = rotas;