/**
 * Модель пользователя для mongoose
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/** Тексты ошибок валидации полей */
const nameValidationErrorText = '"{PATH}" must be 2-32 long alphabetic string';
const loginValidationErrorText = 'Login must be 4-8 long alphanumeric string and start with letter';
const passValidationErrorText =
  'Password must be 6-12 long alphanumeric string and contain at least one number and letter';

/**
 * name - имя пользователя
 * lastname - фамилия пользователя
 * regDate - дата регистрации
 * login - логин
 * pass - пароль
 */
const userSchema = mongoose.Schema({
  lastname: { type: String, required: true, validate: [ nameValidator, nameValidationErrorText ] },
  login: { type: String, required: true, unique: true, validate: [ loginValidator, loginValidationErrorText ] },
  name: { type: String, required: true, validate: [ nameValidator, nameValidationErrorText ] },
  pass: { type: String, required: true, validate: [ passValidator, passValidationErrorText ] },
  regDate: { type: Date, required: true },
});

userSchema.index({ name: 'text', lastname: 'text' });

/** Cохраняем не пароль, а его хеш, используя bcrypt */
userSchema.pre('save', function(next) {
  if (!this.isModified('pass')) {
    return next();
  }

  bcrypt.genSalt((saltErr, salt) => {
    if (saltErr) {
      return next(saltErr);
    }

    bcrypt.hash(this.pass, salt, (hashErr, hash) => {
      if (hashErr) {
        return next(hashErr);
      }

      this.pass = hash;
      next();
    });
  });
});

/** Проверяем пароль, используя bcrypt */
userSchema.methods.comparePass = function(enteredPass, cb) {
  bcrypt.compare(enteredPass, this.pass, function(err, isMatch) {
    if (err) {
      return cb(err);
    }

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
