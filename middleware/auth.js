const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

function auth(req, res, next) {
  const token = req.header("x-bouj-token");
  // console.log("token kham", token);
  if (!token) return res.status(401).send("accsses denied. nat login");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    // console.log(decoded);
    const inject = _.pick(decoded, [
      "_id",
      "userName",
      "followerNumber",
      "followingNumber",
      "avatarSm",
      "ostan"
    ]);
    req.user = inject;
    next();
  } catch (err) {
    res.status(400).send("Invallid Token");
  }
}
module.exports = auth;
