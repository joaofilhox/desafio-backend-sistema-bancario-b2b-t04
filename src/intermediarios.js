const {banco} = require('./bancodedados');

const validarSenha = (req, res, next) => {
    const { senha_banco } = req.query;
    
    if (!senha_banco) {
        return res.status(401).json({ mensagem: 'A senha não foi informada' });
    }

    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: 'A senha está incorreta' });
    }

    return next();
};

module.exports = {
    validarSenha
};