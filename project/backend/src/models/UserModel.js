const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter an email address"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
  },
  contacts: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = model("User", UserSchema);
