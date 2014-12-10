/**
 * Модель пользователя для mongoose
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

/** Тексты ошибок валидации полей */
var nameValidationErrorText = '"{PATH}" must be 2-32 long alphabetic string';
var loginValidationErrorText = 'Login must be 4-8 long alphanumeric string and start with letter';
var passValidationErrorText = 'Password must be 6-12 long alphanumeric string and contain at least one number and letter';

/**
 * name - имя пользователя
 * lastname - фамилия пользователя
 * regDate - дата регистрации
 * login - логин
 * pass - пароль
 */
var userSchema = mongoose.Schema({
  name: { type: String, required: true, validate: [ nameValidator, nameValidationErrorText ] },
  lastname: { type: String, required: true, validate: [ nameValidator, nameValidationErrorText ] },
  regDate: { type: Date, required: true },
  login: { type: String, required: true, unique: true, validate: [ loginValidator, loginValidationErrorText ] },
  pass: { type: String, required: true, validate: [ passValidator, passValidationErrorText ] }
});

userSchema.index({ name: 'text', lastname: 'text' });

/** Cохраняем не пароль, а его хеш, используя bcrypt */
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

/** Проверяем пароль, используя bcrypt */
userSchema.methods.comparePass = function(enteredPass, cb) {
  bcrypt.compare(enteredPass, this.pass, function(err, isMatch) {
    if (err)
      return cb(err);

    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', userSchema);

/** Функции валидации полей */
function nameValidator(value) {
  return /^[A-Za-z]{2,32}$/.test(value);
}

function loginValidator(value) {
  return /^[A-Za-z][A-Za-z0-9]{3,7}$/.test(value);
}

function passValidator(value) {
  return /^[A-Za-z0-9]{6,12}$/.test(value) &&
    /[A-Za-z]/.test(value) &&
    /[0-9]/.test(value);
}