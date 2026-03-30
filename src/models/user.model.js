const { model, Schema } = require("mongoose");
const { Unauthorized } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: 5,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 5,
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    authType: {
      type: String,
      enum: ["local", "google", "facebook"],
      default: "local",
    },
    password: {
      type: String,
      required: function () {
        return this.authType === "local";
      },
      minLength: 5,
    },

    avatar: {
      type: String,
      default: "luffy",
    },

    about: {
      type: String,
      default: "New in this era !!!",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.token;
  delete user.password;
  delete user.isVerified;
  delete user.__v;
  return user;
};

userSchema.statics.findByCredentials = async ({ email, password }) => {
  const user = await User.findOne({ email, isVerified: true }).lean();
  if (!user) throw Unauthorized("Email & password are invalid");

  const isTrue = await bcrypt.compare(password, user.password);
  if (!isTrue) throw Unauthorized("Email & password are invalid");

  return user;
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = model("User", userSchema);

module.exports = User;
