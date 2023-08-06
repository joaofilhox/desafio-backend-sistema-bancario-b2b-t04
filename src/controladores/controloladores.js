let { contas, depositos, transferencias } = require('../bancodedados');
let numeroDaConta = 1;

const contasBancariasExistentes = (req, res) => {

    return res.status(200).json(contas);
};

const criarContaBancaria = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const cpfExists = contas.some(conta => conta.usuario.cpf === cpf);
    const emailExists = contas.some(conta => conta.usuario.email === email);

    if (cpfExists) {
        return res.status(400).json({ mensagem: 'CPF já existe.' });
    }

    if (emailExists) {
        return res.status(400).json({ mensagem: 'Email já existe.' });
    }

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório.' })
    }

    if (!cpf) {
        if (saldo) {
            conta.saldo += saldo;
        }
        return res.status(400).json({ mensagem: 'O campo CPF é obrigatório.' })
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'O campo data de nascimento é obrigatório.' })
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: 'O campo telefone é obrigatório.' })
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório.' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório.' })
    }

    const novaContaBancaria = {
        numero: numeroDaConta++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }
    contas.push(novaContaBancaria);

    return res.status(201).json(novaContaBancaria);
};

const atualizarUsuarioDaConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const cpfExists = contas.some(conta => conta.usuario.cpf === cpf);
    const emailExists = contas.some(conta => conta.usuario.email === email);

    if (cpfExists) {
        return res.status(400).json({ mensagem: 'CPF já existe.' });
    }

    if (emailExists) {
        return res.status(400).json({ mensagem: 'Email já existe.' });
    }

    const usuarioExistente = contas.find(conta => conta.numero === Number(req.params.numeroConta));

    if (!usuarioExistente) {
        return res.status(404).json({ mensagem: 'Não existe conta para substituir para o numero da conta informado.' });
    }

    if (nome) {
        usuarioExistente.usuario.nome = nome;
    }

    if (cpf) {
        usuarioExistente.usuario.cpf = cpf;
    }

    if (data_nascimento) {
        usuarioExistente.usuario.data_nascimento = data_nascimento;
    }

    if (telefone) {
        usuarioExistente.usuario.telefone = telefone;
    }

    if (email) {
        usuarioExistente.usuario.email = email;
    }

    if (senha) {
        usuarioExistente.usuario.senha = senha;

    }

    return res.status(200).json({ mensagem: 'Conta bancária atualizado com sucesso.' });

};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = contas.find((conta) => conta.numero === Number(numeroConta));

    if (!conta) {
        return res.status(404).json({ mensagem: 'Numero da conta não existe.' });
    }

    if (conta.saldo !== 0) {
        return res.status(400).json({ mensagem: 'Não é permitido excluir conta que possua saldo em conta.' });
    }

    contas = contas.filter((conta) => conta.numero !== Number(numeroConta));
    console.log(contas)
    return res.status(200).json({ mensagem: 'Conta excluída com sucesso.' });
};

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const conta = contas.find((conta) => conta.numero === Number(numero_conta));

    if (!conta) {
        return res.status(404).json({ mensagem: 'Numero da conta é invalido.' });
    }

    if (isNaN(Number(valor)) || Number(valor) <= 0) {
        return res.status(404).json({ mensagem: 'Valor não é valido' });
    }

    conta.saldo += Number(valor);

    const novoDeposito = {
        data: new Date(),
        numero_conta: Number(numero_conta),
        valor: valor
    }

    depositos.push(novoDeposito);

    return res.status(200).json({ mensagem: 'Depósito realizado com sucesso' })

};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    const conta = contas.find((conta) => conta.numero === Number(numero_conta));

    if (senha !== conta.usuario.senha) {
        return res.status(404).json({ mensagem: 'Senha invalida' });
    }

    if (!conta) {
        return res.status(404).json({ mensagem: 'Numero da conta é invalido.' });
    }

    if (isNaN(Number(valor)) || Number(valor) > conta.saldo) {
        return res.status(404).json({ mensagem: 'Valor de saque é maior que o saldo da conta não é permitido saque' });
    }

    conta.saldo = (conta.saldo - valor);

    const novoSaque = {
        data: new Date(),
        numero_conta: numero_conta,
        valor: valor
    }

    depositos.push(novoSaque);

    return res.status(200).json({ mensagem: 'Saque realizado com sucesso' })
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    const contaOrigem = contas.find((conta) => conta.numero === Number(numero_conta_origem));
    const contaDestino = contas.find((conta) => conta.numero === Number(numero_conta_destino));
  console.log(contaOrigem)
    if (senha !== contaOrigem.usuario.senha) {
        return res.status(404).json({ mensagem: 'Senha invalida' });
    }

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Numero da conta de origem não existe.' });
    }

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Numero da conta de detino não existe.' });
    }

    if (isNaN(Number(valor)) || Number(valor) > contaOrigem.saldo) {
        return res.status(404).json({ mensagem: 'Tranferencia maior que o saldo da conta não é permitido' });
    }

    contaOrigem.saldo = (contaOrigem.saldo - valor);
    contaDestino.saldo = (contaDestino.saldo + valor);

    const transferencia = {
        data: new Date(),
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor
    }

    transferencias.push(transferencia);

    return res.status(200).json({ mensagem: 'Transferencia realizado com sucesso' })
    

};

 const consultarSaldo = (req, res) => {
    const {numero_conta, senha} = req.query;

    const conta = contas.find((conta) => conta.numero === Number(numero_conta));
    

    if (!conta) {
        return res.status(404).json({mensagem: 'Numero da conta nao existe'})
    }

    if (senha !== conta.usuario.senha) {
        return res.status(404).json({mensagem: 'Senha invalida'})
    }

    const saldoDaConta = {
        saldo: conta.saldo
    }
    console.log(saldoDaConta)

    return res.status(200).json(saldoDaConta);






 };

module.exports = {
    contasBancariasExistentes,
    criarContaBancaria,
    atualizarUsuarioDaConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo
};