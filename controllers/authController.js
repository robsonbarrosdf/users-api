const {User} = require('../models');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, address, phone } = req.body;

  // Seu controller de login deve verificar:
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }  
  
  try {
    const user = await User.create({ name, email, password, address, phone });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ 
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      token 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      token 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};