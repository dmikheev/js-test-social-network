/**
 * Модель пользователя для mongoose
 */

import bcrypt from 'bcrypt';
import mongoose, { Document, Model } from 'mongoose';

/** Тексты ошибок валидации полей */
const nameValidationErrorText = '"{PATH}" must be 2-32 long alphabetic string';
const loginValidationErrorText = 'Login must be 4-8 long alphanumeric string and start with letter';
const passValidationErrorText =
  'Password must be 6-12 long alphanumeric string and contain at least one number and letter';

export interface IUserDocument extends Document {
  lastname: string;
  login: string;
  name: string;
  pass: string;
  regDate: string;

  comparePass(enteredPass: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
  searchByText: TSearchByTextFunc;
}

/**
 * name - имя пользователя
 * lastname - фамилия пользователя
 * regDate - дата регистрации
 * login - логин
 * pass - пароль
 */
const userSchema = new mongoose.Schema({
  lastname: { type: String, required: true, validate: [nameValidator, nameValidationErrorText] },
  login: { type: String, required: true, unique: true, validate: [loginValidator, loginValidationErrorText] },
  name: { type: String, required: true, validate: [nameValidator, nameValidationErrorText] },
  pass: { type: String, required: true, validate: [passValidator, passValidationErrorText] },
  regDate: { type: Date, required: true },
});

userSchema.index({ name: 'text', lastname: 'text' });

/** Cохраняем не пароль, а его хеш, используя bcrypt */
userSchema.pre<IUserDocument>('save', async function(next) {
  if (!this.isModified('pass')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt();
    this.pass = await bcrypt.hash(this.pass, salt);

    return next();
  } catch (err) {
    return next(err);
  }
});

/** Проверяем пароль, используя bcrypt */
userSchema.methods.comparePass = function(enteredPass: string): Promise<boolean> {
  return bcrypt.compare(enteredPass, this.pass);
};

interface ISearchByTextResult {
  totalCount: number;
  users: IUserDocument[];
}
type TSearchByTextFunc =
  (searchString: string, resultsPerPage: number, pageNum: number) => Promise<ISearchByTextResult>;
const searchByText: TSearchByTextFunc = async function(this: IUserModel, searchString, resultsPerPage, pageNum) {
  let countQuery;
  let findQuery;
  if (!searchString) {
    countQuery = this.estimatedDocumentCount();
    findQuery = this.find();
  } else {
    const filter = { $text: { $search: searchString } };
    countQuery = this.countDocuments(filter);
    findQuery = this
      .find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } });
  }

  findQuery = findQuery
    .skip(pageNum * resultsPerPage)
    .limit(resultsPerPage);

  const [totalCount, users] = await Promise.all([countQuery.exec(), findQuery.exec()]);

  return { totalCount, users };
};
userSchema.statics.searchByText = searchByText;

const User: IUserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);
export default User;

/** Функции валидации полей */
function nameValidator(value: string): boolean {
  return /^[A-Za-z]{2,32}$/.test(value);
}

function loginValidator(value: string): boolean {
  return /^[A-Za-z][A-Za-z0-9]{3,7}$/.test(value);
}

function passValidator(value: string): boolean {
  return /^[A-Za-z0-9]{6,12}$/.test(value) &&
    /[A-Za-z]/.test(value) &&
    /[0-9]/.test(value);
}
