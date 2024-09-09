const BlacklistToken = require('../models/BlacklistToken');

const checkBlacklistedToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const blacklistedToken = await BlacklistToken.findOne({ token });

  if (blacklistedToken) {
    return res.status(401).json({ message: 'Token is blacklisted' });
  }

  next();
};

module.exports = checkBlacklistedToken;
