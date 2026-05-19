const { error } = require("../utils/apiResponse");
const { ROLES } = require("../constants");

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.ADMIN) {
    return error(res, "Admin access required.", 403, "FORBIDDEN");
  }
  next();
};

const requireStudent = (req, res, next) => {
  if (!req.user || req.user.role !== ROLES.STUDENT) {
    return error(res, "Student access required.", 403, "FORBIDDEN");
  }
  next();
};

module.exports = { requireAdmin, requireStudent };
