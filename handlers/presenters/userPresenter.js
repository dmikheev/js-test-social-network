module.exports = {
  getData(user, additionalData = {}) {
    const resultData = {};

    if (user._id) {
      resultData.id = user._id;
    }
    if (user.name) {
      resultData.name = user.name;
    }
    if (user.lastname) {
      resultData.lastname = user.lastname;
    }
    if (user.regDate) {
      resultData.regDate = new Date(user.regDate).toLocaleDateString();
    }

    return Object.assign(resultData, additionalData);
  },
};
