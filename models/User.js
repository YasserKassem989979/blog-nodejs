const mongoos = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { secret_key } = require("../config");

const UserSchema = new mongoos.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    bio: String,
    image: {
      type: String,
      match: [
        /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg)/,
        "invalid image url",
      ],
    },
    hash: String,
    salt: String,
  },
  {
    timestamps: true, // createdAt, updateAt auto assigned
  }
);

//add unique validator plugin to user schema
UserSchema.plugin(uniqueValidator, { message: "is already taken" });
// add method to hash password
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};
//is valid pass method
UserSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

//method to generate JWT for user
UserSchema.methods.generateJWT = function () {
  const now = new Date();
  var exp = new Date(now);
  exp.setDate(now.getDate() + 60);

  return jwt.sign(
    {
      id: this.id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret_key
  );
};

// to return JSON for user while authntication
UserSchema.methods.userJson = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
  };
};

//registers our schema with mongoose
mongoos.model("User", UserSchema);
