const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstname: {
    type: String,
    require: true,
    minlength: [2, 'The value of `{PATH}` (`{VALUE}`) is shorter than minimum lenght ({MINLENGTH}).'],
    maxlength: [25, 'The value of `{PATH}` (`{VALUE}`) exceeds the maximum allowed length ({MAXLENGTH}).']
  },
  lastname: {
    type: String,
    require: true,
    minlength: [2, 'The value of `{PATH}` (`{VALUE}`) is shorter than minimum lenght ({MINLENGTH}).'],
    maxlength: [25, 'The value of `{PATH}` (`{VALUE}`) exceeds the maximum allowed length ({MAXLENGTH}).']
  },
  username: {
    type: String,
    require: true,
    unique: true,
    minlength: [2, 'The value of `{PATH}` (`{VALUE}`) is shorter than minimum lenght ({MINLENGTH}).'],
    maxlength: [16, 'The value of `{PATH}` (`{VALUE}`) exceeds the maximum allowed length ({MAXLENGTH}).']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      '`{PATH}` (`{VALUE}`) is invalid.'
    ]
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function (next) {
  const user = this,
  SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.hash(user.password, SALT_FACTOR, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});


userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);
