const isAdmin = async (req, res, next) => {
  if (req.user && req.user.droit === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Accès interdit: droits admin requis' });
};

export default { isAdmin };