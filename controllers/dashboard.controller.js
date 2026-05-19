const { getDashboardStats } = require("../services/dashboard.service");
const { success } = require("../utils/apiResponse");

const getDashboard = async (req, res, next) => {
  try {
    const data = await getDashboardStats();
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard };
