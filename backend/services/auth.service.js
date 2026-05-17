const User = require("../models/User.model");
const { signToken } = require("../utils/jwt");

const register = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("A user with this email already exists.");
    err.statusCode = 409;
    err.code = "EMAIL_EXISTS";
    throw err;
  }
  // role is always 'student' — admins are seeded via script only
  const user = await User.create({ name, email, password, role: "student" });
  return { id: user._id, name: user.name, email: user.email, role: user.role };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    const err = new Error("Invalid email or password.");
    err.statusCode = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  const token = signToken({ id: user._id, role: user.role, name: user.name });
  return { token, role: user.role, id: user._id, name: user.name, email: user.email };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password").lean();
  if (!user) {
    const err = new Error("User not found.");
    err.statusCode = 404;
    err.code = "NOT_FOUND";
    throw err;
  }
  return user;
};

module.exports = { register, login, getUserById };
