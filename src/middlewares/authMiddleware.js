const jwt = require('jsonwebtoken');
const db = require('../firebase');

// memeriksa ketersediaan token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
          status: 'Fail',
          message: 'No token provided or malformed token'
      });
  }

  const token = authHeader.split(' ')[1];
  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded JWT:', decoded); // log hasil dekode JWT
      req.user = decoded; // simpan data pengguna di req.user
      next();
  } catch (error) {
      return res.status(401).json({
          status: 'Fail',
          message: 'Invalid token'
      });
  }
};

module.exports = authenticate;
