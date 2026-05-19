const authService = require("../services/auth.service");
const { success, error } = require("../utils/apiResponse");

const SignUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return error(res, "Name, email and password are required.", 400, "VALIDATION_ERROR");
    }
    const user = await authService.register({ name, email, password });
    return success(res, user, "Registration successful.", 201);
  } catch (err) {
    next(err);
  }
};

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return error(res, "Email and password are required.", 400, "VALIDATION_ERROR");
    }
    const result = await authService.login({ email, password });
    return success(res, result, "Login successful.");
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.params.id);
    return success(res, user);
  } catch (err) {
    next(err);
  }
};

module.exports = { SignUp, Login, getUserById };