const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { successResponse } = require("../controllers/responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helpers/deleteImage");
const { createJSONWebToken } = require("../helpers/jsonwebtoken");
const { jwtActivationKey, clientUrl } = require("../secret");
const sendEmailWithNodeMail = require("../helpers/email");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const searchRegExp = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        {
          name: { $regex: searchRegExp },
        },
        {
          email: { $regex: searchRegExp },
        },
        {
          phone: { $regex: searchRegExp },
        },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);
    const count = await User.find(filter).countDocuments();
    if (!users) throw createError(404, "no users found.");

    return successResponse(res, {
      statusCode: 200,
      message: "Users are returned",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "User is returned successfully",
      payload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const userExits = await User.exists({ email });

    if (userExits) {
      throw createError(407, "User with this email already exits.");
    }
    const token = createJSONWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "10m"
    );

    const emailInfo = {
      email,
      subject: "Account activation Email.",
      html: `
       <h2>Hello ${name}</h2>
       <p>Please click here to <a href="${clientUrl}/api/users/activate/${token}" target="_blank">activate your account</a></p>
      `,
    };

    // try {
    //   await sendEmailWithNodeMail(emailInfo);
    // } catch (error) {
    //   next(createError(500, "Failed to send email."));
    //   return;
    // }

    return successResponse(res, {
      statusCode: 200,
      message: `Plz go to your ${email} for completing your registration process`,
      payload: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;
    deleteImage(userImagePath);

    await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });

    return successResponse(res, {
      statusCode: 200,
      message: "User is deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const activateUserAccount = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) throw createError(404, "Token not found.");
    const decoded = jwt.verify(token, jwtActivationKey);
    const userExits = await User.exists({ email: decoded.email });

    if (userExits) {
      throw createError(407, "User with this email already exits.");
    }
    if (!decoded) throw createError(401, "User is not verified");
    const user = await User.create(decoded);
    return successResponse(res, {
      statusCode: 201,
      message: "User is registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
};
