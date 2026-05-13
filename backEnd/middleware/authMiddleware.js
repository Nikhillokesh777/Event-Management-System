// Check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: '❌ Please login first' });
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: '❌ Admin access only' });
};

module.exports = { isAuthenticated, isAdmin };