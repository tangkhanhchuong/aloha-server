const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const Users = require("../user/user.model");
const { getPresignedUrl } = require("../../core/aws/s3");

const authService = {
  register: async ({ fullname, username, email, password, gender }) => {
    let newUserName = username.toLowerCase().replace(/ /g, "");

    const user = await Users.findOne({ username: newUserName });
    if (user) {
      const err = new Error("This username already exists.");
      err.status = StatusCodes.CONFLICT;
      throw err;
    }

    const userEmail = await Users.findOne({ email });
    if (userEmail) {
      const err = new Error("This email already exists.");
      err.status = StatusCodes.CONFLICT;
      throw err;
    }

    if (password.length < 6) {
      const err = new Error("Password must be at least 6 characters.");
      err.status = StatusCodes.BAD_REQUEST;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new Users({
      fullname,
      email,
      gender,
      username: newUserName,
      password: hashedPassword,
    });

    const accessToken = createAccessToken({ id: newUser._id });
    const refreshToken = createRefreshToken({ id: newUser._id });
    await newUser.save();

    const avatar = await getPresignedUrl(newUser.avatar);

    return {
      accessToken,
      refreshToken,
      user: {
        ...newUser._doc,
        avatar,
        password: null,
      },
    };
  },

  login: async ({ email, password }) => {
    const user = await Users.findOne({ email }).populate(
      "followers following",
      "avatar username fullname followers following"
    );

    if (!user) {
      const err = new Error("This email does not exist.");
      err.status = StatusCodes.NOT_FOUND;
      throw err;
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      const err = new Error("Password is incorrect.");
      err.status = StatusCodes.UNAUTHORIZED;
      throw err;
    }
    const accessToken = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    const avatar = await getPresignedUrl(user.avatar);

    return {
      accessToken,
      refreshToken,
      user: {
        ...user._doc,
        avatar,
        password: null,
      },
    };
  },

  generateAccessToken: async ({ refreshToken }) => {
    if (!refreshToken) {
      const err = new Error("Please login now.");
      err.status = StatusCodes.BAD_REQUEST;
      throw err;
    }

    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, result) => {
          if (err) {
            const err = new Error("Please login now.");
            err.status = StatusCodes.UNAUTHORIZED;
            return reject(err);
          }

          const user = await Users.findById(result.id)
            .select("-password")
            .populate(
              "followers following",
              "avatar username fullname followers following"
            );

          if (!user) {
            const err = new Error("This does not exist.");
            err.status = StatusCodes.NOT_FOUND;
            return reject(err);
          }

          const accessToken = createAccessToken({ id: result.id });
          user.avatar = await getPresignedUrl(user.avatar);
          resolve({
            user,
            accessToken,
          });
        }
      );
    });
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = authService;
