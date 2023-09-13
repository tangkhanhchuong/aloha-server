const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const Users = require("../models/user.model");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid Authentication." });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid Authentication." });

    const user = await Users.findOne({ _id: decoded.id });
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: err.message });
  }
};

module.exports = auth;
