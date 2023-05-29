const auth = (req, res, next) => {
    try {
      req.user = null;
      req.admin = false;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = auth;
  