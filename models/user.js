const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

const Schema = mongoose.Schema;

let userSchema = new Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  mobile: {
    type: String,
  },
});

userSchema.methods.toJSON = function () {
  const self = this;
  const selfObject = self.toObject();
  return _.pick(selfObject, [
    '_id',
    'email',
    'firstname',
    'lastname',
    'mobile',
  ]);
};

let User = mongoose.model('User', userSchema);

module.exports = { User };
