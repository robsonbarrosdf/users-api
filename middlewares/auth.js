const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  // Verifica se o header existe
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Extrai o token
  const token = authHeader.split(' ')[1];

  try {
    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adiciona o usuário decodificado à requisição
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};