const mongoose = require("mongoose");
const enums = require("../utils/enums");

const userSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: [enums.ROLE.ADMIN, enums.ROLE.USER],
      default: enums.ROLE.USER,
    },
    name: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      trim: true,
      minlength: 6,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
