const { verifyToken } = require("../utils/jwt");
const { error } = require("../utils/apiResponse");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, "Authentication required. Please log in.", 401, "UNAUTHORIZED");
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, "Invalid or expired token. Please log in again.", 401, "TOKEN_INVALID");
  }
};

module.exports = { authenticate };
