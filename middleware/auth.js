const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-bouj-token");
  if (!token) return res.status(401).send("accsses denied. nat login");

  try {
    const token = jwt.verify(token, config.get("jwtPrivateKey"));
    console.log(token);
    req.user = token;
    next();
  } catch (err) {
    res.status(400).send("Invallid Token");
  }
}
module.exports = auth;
