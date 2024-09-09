const jwt = require("jsonwebtoken");

const JWT_SECRET = "my_secret_key";
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Auth Header:", authHeader);

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("No token found");
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification error:", err);
      return res.sendStatus(403);
    }

    console.log("Token verified, user:", user);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
