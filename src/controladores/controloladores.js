let { contas, saques, depositos, transferencias } = require('../bancodedados');
let numeroDaConta = 1;

const contasBancariasExistentes = (req, res) => {

    return res.status(200).json(contas);
};

const criarContaBancaria = (req, res) => {
    let { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    const cpfExists = contas.some(conta => conta.usuario.cpf === cpf);
    const emailExists = contas.some(conta => conta.usuario.email === email);

    if (cpfExists) {
        return res.status(400).json({ mensagem: 'CPF já existe' });
    }

    if (emailExists) {
        return res.status(400).json({ mensagem: 'Email já existe' });
    }

    if (!nome) {
        return res.status(400).json({ mensagem: 'O campo nome é obrigatório' });
    }

    if (!cpf) {
        return res.status(400).json({ mensagem: 'O campo CPF é obrigatório' });
    }

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'O campo data de nascimento é obrigatório' });
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: 'O campo telefone é obrigatório' });
    }

    if (!email) {
        return res.status(400).json({ mensagem: 'O campo email é obrigatório' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'O campo senha é obrigatório' });
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
    };

    contas.push(novaContaBancaria);

    return res.status(201).json(novaContaBancaria);
};

const atualizarUsuarioDaConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    let contador = true;

    const usuarioExistente = contas.find(conta => conta.numero === Number(req.params.numeroConta));

    if (!usuarioExistente) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    const cpfExists = contas.some(conta => conta.usuario.cpf === cpf);
    const emailExists = contas.some(conta => conta.usuario.email === email);

    if (cpfExists) {
        return res.status(400).json({ mensagem: 'CPF já existe' });
    }

    if (emailExists) {
        return res.status(400).json({ mensagem: 'Email já existe' });
    }

    if (nome) {
        usuarioExistente.usuario.nome = nome;
        contador = false;
    }

    if (cpf) {
        usuarioExistente.usuario.cpf = cpf;
        contador = false;
    }

    if (data_nascimento) {
        usuarioExistente.usuario.data_nascimento = data_nascimento;
        contador = false;
    }

    if (telefone) {
        usuarioExistente.usuario.telefone = telefone;
        contador = false;
    }

    if (email) {
        usuarioExistente.usuario.email = email;
        contador = false;
    }

    if (senha) {
        usuarioExistente.usuario.senha = senha;
        contador = false;

    }

    if (contador) {
        return res.status(400).json({ mensagem: 'Nenhuma propriedade foi passada' });
    }

    return res.status(200).json({ mensagem: 'Conta atualizado com sucesso' });

};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = contas.find((conta) => conta.numero === Number(numeroConta));

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (conta.saldo !== 0) {
        return res.status(400).json({ mensagem: 'Não é permitido excluir conta que possua saldo em conta' });
    }

    contas = contas.filter((conta) => conta.numero !== Number(numeroConta));

    return res.status(200).json({ mensagem: 'Conta excluída com sucesso.' });
};

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    const conta = contas.find((conta) => conta.numero === Number(numero_conta));

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (isNaN(Number(valor)) || Number(valor) <= 0) {
        return res.status(404).json({ mensagem: 'Valor não é valido' });
    }

    conta.saldo += Number(valor);
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString().replace('T', ' ').substr(0, 19);

    const novoDeposito = {
        data: dataFormatada,
        numero_conta: Number(numero_conta),
        valor: valor
    }

    depositos.push(novoDeposito);

    return res.status(200).json({ mensagem: 'Depósito realizado com sucesso' })

};

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    const conta = contas.find((conta) => conta.numero === Number(numero_conta));

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }

    if (isNaN(Number(valor)) || Number(valor) <= 0) {
        return res.status(404).json({ mensagem: 'Valor não é valido' });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(404).json({ mensagem: 'Senha invalida' });
    }

    if (isNaN(Number(valor)) || Number(valor) > conta.saldo) {
        return res.status(404).json({ mensagem: 'Valor de saque é maior que o saldo da conta não é permitido saque' });
    }

    conta.saldo = (conta.saldo - valor);
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString().replace('T', ' ').substr(0, 19);

    const novoSaque = {
        data: dataFormatada,
        numero_conta: numero_conta,
        valor: valor
    }

    saques.push(novoSaque);

    return res.status(200).json({ mensagem: 'Saque realizado com sucesso' })
};

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    const contaOrigem = contas.find((conta) => conta.numero === Number(numero_conta_origem));
    const contaDestino = contas.find((conta) => conta.numero === Number(numero_conta_destino));

    if (!contaOrigem) {
        return res.status(404).json({ mensagem: 'Numero da conta de origem não existe.' });
    }

    if (!contaDestino) {
        return res.status(404).json({ mensagem: 'Numero da conta de detino não existe.' });
    }

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(404).json({ mensagem: 'Senha invalida' });
    }


    if (isNaN(Number(valor)) || Number(valor) > contaOrigem.saldo) {
        return res.status(404).json({ mensagem: 'Tranferencia maior que o saldo da conta não é permitido' });
    }

    contaOrigem.saldo = (contaOrigem.saldo - valor);
    contaDestino.saldo = (contaDestino.saldo + valor);
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString().replace('T', ' ').substr(0, 19);

    const transferencia = {
        data: dataFormatada,
        numero_conta_origem: numero_conta_origem,
        numero_conta_destino: numero_conta_destino,
        valor: valor
    }

    transferencias.push(transferencia);

    return res.status(200).json({ mensagem: 'Transferência realizado com sucesso' })


};

const consultarSaldo = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(404).json({ mensagem: 'O número da conta ou senha não foi informado' })
    }

    const conta = contas.find((conta) => conta.numero === Number(numero_conta));


    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }

    if (senha !== conta.usuario.senha) {
        return res.status(404).json({ mensagem: 'Senha invalida' })
    }

    const saldoDaConta = {
        saldo: conta.saldo
    }

    return res.status(200).json(saldoDaConta);

};

const extrato = (req, res) => {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(404).json({ mensagem: 'O número da conta ou senha não foi informado' })
    }

    const conta = contas.find((conta) => conta.numero === Number(numero_conta));


    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' })
    }

    if (senha !== conta.usuario.senha) {
        return res.status(404).json({ mensagem: 'Senha invalida' })
    }

    const depositosDaConta = depositos.filter((deposito) => deposito.numero_conta == Number(numero_conta));
    const saquesDaConta = saques.filter((saque) => saque.numero_conta == numero_conta);
    const transferenciasDaConta = transferencias.filter((transferencia) => transferencia.numero_conta_origem == numero_conta);

    const extratoDaConta = {
        depositos: depositosDaConta,
        saques: saquesDaConta,
        transferencias: transferenciasDaConta
    }

    return res.status(200).json(extratoDaConta);
};

module.exports = {
    contasBancariasExistentes,
    criarContaBancaria,
    atualizarUsuarioDaConta,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    extrato
};