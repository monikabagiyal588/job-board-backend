const jwt = require('jsonwebtoken');
const SECRET = 'jwt-secret-key';

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    req.role = decoded.role;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
