require("dotenv").config();
const mongoose = require("mongoose");
const { Unauthorized } = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
  },

  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 5,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 5,
  },

  avatar: {
    type: String,
  },

  about: {
    type: String,
    default: "New in this era !!!",
  },

  token: {
    type: String,
  },

  verified: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.token;
  delete user.password;
  delete user.verified;
  delete user.__v;
  return user;
};

userSchema.statics.findByCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw Unauthorized("Email & password are invalid");

  const isTrue = await bcrypt.compare(password, user.password);
  if (!isTrue) throw Unauthorized("Email & password are invalid");

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
  this.token = token;
  await this.save();

  return token;
};

userSchema.methods.generateVerificationLink = async function () {
  let link = process.env.DOMAIN + "/api/verification/email/";
  const _id = this._id.toString();
  const token = jwt.sign({ _id }, process.env.SECRET_KEY, { expiresIn: "10m" });
  link = link + token;
  return link;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
