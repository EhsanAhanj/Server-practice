const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-bouj-token");
  // console.log("token kham", token);
  if (!token) return res.status(401).send("accsses denied. nat login");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    // console.log(decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invallid Token");
  }
}
module.exports = auth;
