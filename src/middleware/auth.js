const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const Users = require('../module/user/user.model');
const { AUTH } = require('../shared/message');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: AUTH.UNAUTHENTICATED });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: AUTH.SESSION_EXPIRED });
    }
    
    const user = await Users.findOne({ _id: decoded.id });
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: err.message });
  }
};

module.exports = auth;
