const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return /^([a-z0-9_\.-]+)@([\da-z\.-]+).([a-z\.]{2,6})$/.test(value);
      },
      message: "Invalid Email Format.",
    },
  },
  thoughts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thought" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
