const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  member: { type: Boolean, default: false },
  admin: { type: Boolean, default: false },
  create_at: { type: Date, default: Date.now },
});

userSchema
  .virtual('create_at_formatted')
  .get(function () {
    return this.create_at.toLocaleDateString('en-GB');
  });

module.exports = mongoose.model('User', userSchema);
