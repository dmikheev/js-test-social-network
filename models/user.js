var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// TODO: add validation
var userSchema = mongoose.Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  regDate: { type: Date, required: true },
  login: { type: String, required: true, unique: true },
  pass: { type: String, required: true }
});

userSchema.index({ name: 'text', lastname: 'text' });

// сохраняем не пароль, а его хеш
userSchema.pre('save', function(next) {
  var user = this;

  if (!user.isModified('pass'))
    return next();

  bcrypt.genSalt(function(err, salt) {
    if (err)
      return next(err);

    bcrypt.hash(user.pass, salt, function(err, hash) {
      if (err)
        return next(err);

      user.pass = hash;
      next();
    });
  });
});

userSchema.methods.comparePass = function(enteredPass, cb) {
  bcrypt.compare(enteredPass, this.pass, function(err, isMatch) {
    if (err)
      return cb(err);

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);