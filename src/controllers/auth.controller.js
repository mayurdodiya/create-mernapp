const commonService = require("../utils/utils");
const emailService = require("../services/email-sending");
const bcrypt = require("bcryptjs");
const message = require("../utils/message");
const emailTemplate = require("../templates/emailTemplate");
const { UserModel, OtpModel } = require("../models");
const apiResponse = require("../utils/api.response");
const moment = require("moment");
const logger = require("../config/logger");

// login (User) 
module.exports = {
  userRegister: async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;

      const existingUser = await UserModel.findOne({ email, deletedAt: null, isActive: true });
      if (existingUser) return apiResponse.BAD_REQUEST({ res, message: message.DATA_EXIST("User"), });

      const hashedPassword = await commonService.generateHashPassword(password);

      let newUser = await UserModel.create({
        name,
        email,
        phone,
        password: hashedPassword,
      });

      newUser = newUser.toObject();
      delete newUser.password;

      return apiResponse.OK({ res, message: message.REGISTERED('User'), data: newUser, });
    } catch (err) {
      console.log("Register error:", err);
      return apiResponse.CATCH_ERROR({ res, message: message.INTERNAL_SERVER_ERROR, });
    }
  },

  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;

      let user = await UserModel.findOne({ email, deletedAt: null, isActive: true });

      if (!user) return apiResponse.NOT_FOUND({ res, message: message.NO_DATA("Email"), });

      const isPasswordValid = commonService.passwordCompare(password, user.password);
      if (!isPasswordValid) return apiResponse.BAD_REQUEST({ res, message: message.INVALID("Password"), });

      user = user.toObject();
      delete user.password;
      user.token = commonService.generateToken(user._id, user.role);
      return apiResponse.OK({ res, message: message.LOGIN_SUCCESS, data: user, });
    } catch (err) {
      console.log("error userLogin", err);
      return apiResponse.CATCH_ERROR({ res, message: message.INTERNAL_SERVER_ERROR, });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      let { page = 0, size = 10, search = "" } = req.query;

      page = parseInt(page);
      size = parseInt(size);

      const skip = page * size;

      let condition = {
        deletedAt: null,
        isActive: true,
      };

      if (search) {
        condition.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ];
      }

      const [users, total] = await Promise.all([
        UserModel.find(condition)
          .select("-password")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(size),

        UserModel.countDocuments(condition),
      ]);

      const response = {
        totalItems: total,
        data: users,
        totalPages: Math.ceil(total / size),
        currentPage: page,
      };

      return apiResponse.OK({ res, message: message.GET_DATA("User"), data: response, });

    } catch (err) {
      console.log("getAllUsers error:", err);
      return apiResponse.CATCH_ERROR({ res, message: message.INTERNAL_SERVER_ERROR, });
    }
  },

  sendOtp: async (req, res) => {
    try {
      const { email } = req.body;

      const emailExist = await UserModel.findOne({
        email,
        deletedAt: null,
      }).populate("roleId");

      if (!emailExist) {
        return apiResponse.NOT_FOUND({
          res,
          message: message.NO_DATA("Email"),
        });
      }

      const generateOtp = () =>
        ("0".repeat(4) + Math.floor(Math.random() * 10 ** 4)).slice(-4);

      let otp = await generateOtp();

      const expireTime = moment().add(10, "minute");
      await OtpModel.findOneAndUpdate(
        { userId: emailExist._id },
        { $set: { otp: otp, userId: emailExist._id, expires: expireTime } },
        { upsert: true }
      );

      await emailService.sendEmail(
        email,
        "Verify Otp",
        emailTemplate.sendOTP(email, otp)
      );

      return apiResponse.OK({
        res,
        message: message.OTP_SENT("email"),
      });
    } catch (err) {
      console.log("error generating", err);
      return apiResponse.CATCH_ERROR({
        res,
        message: message.INTERNAL_SERVER_ERROR,
      });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;

      let emailExist = await UserModel.findOne({
        email,
        deletedAt: null,
      }).populate("roleId");

      if (!emailExist) {
        return apiResponse.NOT_FOUND({
          res,
          message: message.NO_DATA("Email"),
        });
      }

      let otpExists = await OtpModel.findOne({ userId: emailExist._id });
      console.log(`---otpExists--`, otpExists);

      if (!otpExists) {
        return apiResponse.NOT_FOUND({ res, message: message.INVALID("OTP") });
      }

      if (otpExists.otp !== otp) {
        return apiResponse.BAD_REQUEST({ res, message: message.INVALID("OTP") });
      }

      if (otpExists.expires <= new Date()) {
        return apiResponse.BAD_REQUEST({ res, message: message.OTP_EXPIRED("OTP") });
      }

      return apiResponse.OK({
        res,
        message: message.OTP_VERIFY("OTP"),
      });
    } catch (err) {
      console.log("error generating", err);
      return apiResponse.CATCH_ERROR({
        res,
        message: message.INTERNAL_SERVER_ERROR,
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const reqBody = req.body;

      const emailExist = await UserModel.findOne({
        email: reqBody.email,
        deletedAt: null,
      }).populate("roleId"); // Get user by email.

      if (!emailExist) {
        return apiResponse.NOT_FOUND({
          res,
          message: message.NO_DATA("Email"),
        });
      }

      let password = await bcrypt.hashSync(reqBody.password, 8);

      await UserModel.findOneAndUpdate(
        { _id: emailExist._id, deletedAt: null },
        { $set: { password: password } },
        { new: true }
      );

      return apiResponse.OK({
        res,
        message: message.FORGOT("Password"),
      });
    } catch (err) {
      console.log("error generating", err);
      return apiResponse.CATCH_ERROR({
        res,
        message: message.INTERNAL_SERVER_ERROR,
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const reqBody = req.body;

      const user = await UserModel.findOne({ _id: req.user._id });

      if (!bcrypt.compareSync(reqBody.oldPassword, user.password)) {
        return apiResponse.BAD_REQUEST({
          res,
          message: message.OLD_PWD_WRONG,
        });
      }

      let password = await bcrypt.hashSync(reqBody.newPassword, 8);

      await UserModel.findOneAndUpdate(
        { _id: req.user._id._id, deletedAt: null },
        { $set: { password: password } },
        { new: true }
      );

      return apiResponse.OK({
        res,
        message: message.FORGOT("Password"),
      });
    } catch (err) {
      console.log("error generating", err);
      return apiResponse.CATCH_ERROR({
        res,
        message: message.INTERNAL_SERVER_ERROR,
      });
    }
  },
};
