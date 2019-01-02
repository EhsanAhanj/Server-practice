function admin(req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).send("Accsess Denied not admin");
  next();
}

module.exports = admin;
